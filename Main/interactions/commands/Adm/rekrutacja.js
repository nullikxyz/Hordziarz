const { SlashCommandBuilder } = require("@discordjs/builders");
const mongoose = require("mongoose");
const inneData = require("../../../models/inne");
const moment = require("moment");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("rekrutacja")
		.setDescription("Komenda do zarządzania rekrutacją.")
		.addIntegerOption((integer) => integer.setName("opcja").setDescription("podania - możliwość wysyłania podań, akcpetowanie - możliwość akceptacji lub odrzucania podań.").addChoices({ name: "podania", value: 1 }, { name: "akceptowanie", value: 0 }).setRequired(true))
		.addIntegerOption((integer) => integer.setName("akcja").setDescription("Jaką akcję chcesz wykonać.").addChoices({ name: "włącz", value: 1 }, { name: "wyłącz", value: 0 }).setRequired(true)),
	async execute(client, interaction) {
		try {
			let opcja = interaction.options.getInteger("opcja");
			let akcja = interaction.options.getInteger("akcja");
			let data = await inneData.findOne({ name: "rekrutacja" });

			if (opcja) {
				if (akcja) {
					if (data.value.open) return client.error(interaction, { description: "Rekrutacja już trwa!" }, [], true);

					let threadAccept = await interaction.guild.channels.cache.get(client.config.channels.rekrutacja).threads.create({
						name: `Rekrutacja ${moment().format("DD-MM-YYYY")} przyjete`,
						autoArchiveDuration: 10080,
						reason: "Rekrutacja",
					});
					let threadDeny = await interaction.guild.channels.cache.get(client.config.channels.rekrutacja).threads.create({
						name: `Rekrutacja ${moment().format("DD-MM-YYYY")} odrzucone`,
						autoArchiveDuration: 10080,
						reason: "Rekrutacja",
					});

					data.value = {
						open: true,
						accept: false,
						startedAt: Date.now(),
						threadId: {
							odrzucone: threadDeny.id,
							przyjete: threadAccept.id,
						},
					};

					await data.save().catch((e) => console.log(e));
					return client.success(interaction, { description: "Rekrutacja została otwarta!" });
				} else {
					if (!data.value.open) return client.error(interaction, { description: "Rekrutacja jest już wyłączona!" }, [], true);

					data.value = {
						open: false,
						accept: data.value.accept,
						startedAt: null,
						threadId: null,
					};

					await data.save().catch((e) => console.log(e));
					return client.success(interaction, { description: "Rekrutacja została zamknięta!" });
				}
			} else {
				if (akcja) {
					if (data.value.accept) return client.error(interaction, { description: "Akceptowanie podań jest już możliwe!" });
					data.value.accept = true;
					await inneData.findByIdAndUpdate(data._id, data);
					return client.success(interaction, { description: "Akceptowanie podań jest teraz możliwe!" });
				} else {
					if (!data.value.accept) return client.error(interaction, { description: "Akceptowanie nie jest możliwe!" });
					data.value.accept = false;
					await inneData.findByIdAndUpdate(data._id, data);
					return client.success(interaction, { description: "Akceptowanie podań jest teraz niemożliwe!" });
				}
			}
		} catch (err) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			console.log(err);
		}
	},
};
