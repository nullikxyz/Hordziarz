const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "reporterzy",
	async execute(client, interaction) {
		try {
			const temat = interaction.fields.getTextInputValue("temat");
			const opis = interaction.fields.getTextInputValue("opis");
			const zrodla = interaction.fields.getTextInputValue("zrodla");

			client.channels.cache.get(client.config.channels.reporterzy).send({
				content: `${interaction.member}`,
				embeds: [
					new EmbedBuilder()
						.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
						.setColor(client.config.embedHex)
						.setDescription(`**Temat:**\n${temat}\n\n**Opis:**\n${opis}${zrodla ? `\n\n**Źródła:**\n${zrodla}` : ""}`),
				],
			});
			await interaction.deferReply({ ephemeral: true });
			client.success(interaction, { description: "Twój temat został wysłany do naszego zespołu reporterów! Dziekujemy za pomoc!" })
		} catch (e) {
			console.log(e);
		}
	},
};
