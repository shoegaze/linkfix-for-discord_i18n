import {
  CachedManager,
  Client,
  Collection,
  CommandInteraction,
  Events,
  GatewayIntentBits,
} from "discord.js";
import { Commands } from "./commands";
import { replacements } from "./replacements";
import { CustomCommand } from "./@types/custom";
import dotenv from "dotenv";

dotenv.config();

const replacementsEntries = Object.entries(replacements);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
for (const cmd of Commands) {
  client.commands.set(cmd.data.name, cmd);
}

client.once(Events.ClientReady, (eventClient) => {
  client.user?.setActivity("/help");

  console.log(`Ready! Logged in as ${eventClient.user.tag}.`);

  const guildCount = eventClient.guilds.cache.size;
  console.log(
    `Present in ${guildCount} ${guildCount === 1 ? "guild" : "guilds"}.`,
  );
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  await command.execute(interaction);
});

client.on(Events.MessageCreate, (message) => {
  if (message.author.bot) {
    // Avoid infinite loop by replying to self, or another bot that would reply to me
    return;
  }

  let reply = "";
  for (const [identifier, replacer] of replacementsEntries) {
    if (message.content.includes(identifier)) {
      const result = replacer(message.content);

      if (result) {
        reply += result + "\n";
      }
    }
  }

  if (reply === "") {
    return;
  }

  message
    .reply({ content: reply, allowedMentions: { repliedUser: false } })
    .catch((err) => {
      const errMsg: string = (err as Error).message;

      if (errMsg.includes("Missing Permissions")) {
        return;
      }

      console.error("> Failed to reply: ", (err as Error).message);
    });
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_BOT_TOKEN);
