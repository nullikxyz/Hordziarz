const { SlashCommandBuilder } = require("@discordjs/builders");
const walentynki = require("../../../models/walentynki");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("walentynkispr")
		.setDescription("Sprawdzanie walentynek")
		.addStringOption((string) => string.setName("id").setDescription("custom id").setMaxLength(8).setMinLength(8).setRequired(true)),
	hidden: true,
	async execute(client, interaction) {
		try {
			let customId = interaction.options.getString("id");

			let walentynka = await walentynki.findOne({ code: customId });

			if (!walentynka) return client.error(interaction, { description: "Błędne ID walentynki" });

			client.success(interaction, {
				fields: [
					{ name: "Nadawca", value: `<@${walentynka.from}> \`(${walentynka.from})\``, inline: true },
					{ name: "Odbiorca", value: `<@${walentynka.to}> \`(${walentynka.to})\``, inline: true },
					{ name: "Custom ID", value: `${walentynka.code}`, inline: true },
					{ name: "Treść", value: `${walentynka.text}` },
				],
			});
		} catch (err) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
