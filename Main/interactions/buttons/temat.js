const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
	name: "temat",
	async execute(client, interaction) {
		try {
			const modal = new ModalBuilder().setCustomId("reporterzy").setTitle("Tematy dla reporterów!");

			const tematLabel = new TextInputBuilder().setCustomId("temat").setLabel("Temat").setStyle(TextInputStyle.Short).setMinLength(8).setMaxLength(32).setPlaceholder("Podaj temat.").setRequired(true);
			const opisLabel = new TextInputBuilder().setCustomId("opis").setLabel("Opis").setStyle(TextInputStyle.Paragraph).setMinLength(16).setMaxLength(2048).setPlaceholder("Opisz swój temat.").setRequired(true);
			const zrodlaLabel = new TextInputBuilder().setCustomId("zrodla").setLabel("Źródła").setStyle(TextInputStyle.Short).setMinLength(16).setMaxLength(128).setPlaceholder("Podaj źródła z jakich otrzymałeś tą informację.");

			const row1 = new ActionRowBuilder().addComponents([tematLabel]);
			const row2 = new ActionRowBuilder().addComponents([opisLabel]);
			const row3 = new ActionRowBuilder().addComponents([zrodlaLabel]);
			modal.addComponents([row1, row2, row3]);

			await interaction.showModal(modal);
		} catch (e) {
			console.log(e);
		}
	}
};
