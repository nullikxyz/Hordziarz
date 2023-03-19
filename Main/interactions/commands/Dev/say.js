const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("say")
		.setDescription("Mów botem!")
		.addStringOption((string) => string.setName("wiadomosc").setDescription("Wiadomość").setRequired(true))
		.addIntegerOption((integer) => integer.setName("powtorzenia").setDescription("Ilość powtórzeń wiadomości").setMinValue(1).setMaxValue(1000))
		.addChannelOption((channel) => channel.setName("kanał").setDescription("Kanał, na który chcesz wysłac wiadomość.").addChannelTypes(0))
		.addBooleanOption((bool) => bool.setName("embed").setDescription("Czy wiadomość ma być w embedzie")),
	async execute(client, interaction) {
		try {
			const repeat = interaction.options.getInteger("powtorzenia") || 1;
			const message = interaction.options.getString("wiadomosc");
			const channel = interaction.options.getChannel("kanał") || interaction.channel;

			let finalMsg = "";
			for (i = 0; i < repeat; i++) {
				finalMsg += message + "\n";
			}
			if (finalMsg.length > 2000) return client.error(interaction, { description: "Wiadomość jest za długa!" });

			interaction.deleteReply();

			interaction.options.getBoolean("embed") ? channel.send({ embeds: [new EmbedBuilder().setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(finalMsg).setColor(client.config.embedHex)] }) : channel.send(finalMsg);
		} catch (err) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
