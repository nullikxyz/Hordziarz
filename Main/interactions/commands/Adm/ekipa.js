const { ekipa_discorda } = require("../../../functions/client/schedules");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder().setName("ekipa").setDescription("Aktualizuje listę ekipy"),
	async execute(client, interaction) {
		try {
			client.error(interaction, { description: "Aktualizowanie..." });
			await ekipa_discorda(client);
			client.success(interaction, { description: "Zaktualizowano!" });
		} catch (err) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
