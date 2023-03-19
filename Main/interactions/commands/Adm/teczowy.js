const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("tęczowy")
		.setDescription("Zmienia kolor rangi Tęczowy")
		.addStringOption((string) => string.setName("kolor").setDescription("Kolor rangi Tęczowy")),
	async execute(client, interaction) {
		try {
			const kolor = interaction.options.getString("kolor");
			let random;

			if (kolor)
				if (kolor.match(/^[A-Za-z0-9]+$/g)) random = kolor.match(/^[A-Za-z0-9]+$/g);
				else return client.error(interaction, { description: "Podano błędny kolor rangi!" });
			else random = Math.floor(Math.random() * 16777215).toString(16);

			if (random.length > 6) random.substring(0, 6);
			while (random.length != 6) random = `0${random}`;

			interaction.guild.roles.cache.get(client.config.roles.inne.teczowa).setColor(`#${random}`);
			client.success(interaction, { description: `Ustawiono nowy kolor rangi <@&${client.config.roles.inne.teczowa}> na ${random}` });
		} catch (err) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
