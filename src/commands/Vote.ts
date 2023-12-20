import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const VoteCommand = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Vote for LinkFix on Top.gg!"),
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply({
      content:
        "If you enjoy LinkFix, please consider voting for the bot on Top.gg!\nhttps://top.gg/bot/385950397493280805/vote",
      ephemeral: true,
    });
  },
};