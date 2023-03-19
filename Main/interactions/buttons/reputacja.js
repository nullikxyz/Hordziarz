const { setCooldown, getCooldown, checkCooldown } = require("../../functions/client/cooldown");
const mongoose = require("mongoose");
const profilModel = require("../../models/profil");
const humanizeDuration = require("../../functions/time/humanizeDuration");

module.exports = {
	name: "reputacja",
	async execute(client, interaction) {
		try {
			await interaction.deferReply({ ephemeral: true });
			if (!interaction.member.roles.cache.some((x) => client.config.roles.textLvl.slice(1).includes(x.id)) && !interaction.member.roles.cache.some((x) => client.config.roles.voiceLvl.slice(1).includes(x.id))) return client.error(interaction, { description: "Musisz posiadać minimum 5 poziom aby dawać reputację." });

			let akcja = interaction.customId.split("-")[1].split("_")[0];
			let target = interaction.customId.split("-")[1].split("_")[1];
			let przeciwne = akcja == "plus" ? "minus" : "plus";

			if (interaction.member.id == target) return client.error(interaction, { description: "Nie możesz dawać reputacji samemu sobie." });
			let profilData = await profilModel.findOne({ userId: target });

			if (await checkCooldown(client, interaction.user.id, `reputacja-${target}`)) return client.error(interaction, { description: `Ponowna zmiana reputacji dostepna będzie za: \`${humanizeDuration((await getCooldown(client, interaction.user.id, `reputacja-${target}`)) - Date.now())}\`` });

			if (profilData.reputacja[akcja].includes(interaction.member.id)) {
				profilData.reputacja[akcja].splice(profilData.reputacja[akcja].indexOf(interaction.member.id), 1);
				client.success(interaction, { description: "Pomyślnie zabrano reputację." }, [], true);
			} else if (profilData.reputacja[przeciwne].includes(interaction.member.id)) {
				profilData.reputacja[przeciwne].splice(profilData.reputacja[przeciwne].indexOf(interaction.member.id), 1);
				profilData.reputacja[akcja].push(interaction.member.id);

				client.success(interaction, { description: "Pomyślnie zmienionp reputację." }, [], true);
			} else {
				profilData.reputacja[akcja].push(interaction.member.id);
				client.success(interaction, { description: "Pomyślnie dodano reputację uzytkownikowi." }, [], true);
			}
			await profilData.save().catch((e) => console.log(e));
			await setCooldown(client, interaction.user.id, `reputacja-${target}`, Date.now() + 21600000);
		} catch (e) {
			console.log(e);
		}
	}
};
