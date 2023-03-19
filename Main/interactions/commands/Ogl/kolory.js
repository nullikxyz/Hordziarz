const { SlashCommandBuilder } = require("@discordjs/builders");
const inventory = require("../../../models/profil");

let kolory = [
	{ name: "Tęczowy", value: "934128137757929522" },
	{ name: "Złoty", value: "917868457624752179" },
	{ name: "Purpurowy", value: "917869767333916732" },
	{ name: "Magenta", value: "917870502721237062" },
	{ name: "Kremowy", value: "918480597607907329" },
	{ name: "Miętowy", value: "918485413822345276" },
	{ name: "Szary", value: "918573932565626941" },
	{ name: "Biały", value: "610108895238553620" },
	{ name: "Niebieski", value: "610109118622990358" },
	{ name: "Seledynowy", value: "610109317978390529" },
	{ name: "Różowy", value: "610109677610467338" },
	{ name: "Fioletowy", value: "610109462472032301" },
	{ name: "Czarny", value: "610109826680225812" },
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName("kolory")
		.setDescription("Komenda do zarządzania swoimi kolorami")
		.addSubcommand((sc) => sc.setName("ekwipunek").setDescription("Zobacz jakie kolory posiadasz w swoim ekwipunku."))
		.addSubcommand((sc) =>
			sc
				.setName("zdejmij")
				.setDescription("Zdejmij wybrany kolor do ekwipunku.")
				.addStringOption((string) =>
					string
						.setName("kolor")
						.setDescription("Kolor do zdjęcia.")
						.addChoices(...kolory)
						.setRequired(true)
				)
		)
		.addSubcommand((sc) =>
			sc
				.setName("załóż")
				.setDescription("Załóż wybrany kolor z ekwipunku..")
				.addStringOption((string) =>
					string
						.setName("kolor")
						.setDescription("Kolor do założenia.")
						.addChoices(...kolory)
						.setRequired(true)
				)
		),
	async execute(client, interaction) {
		let akcja = interaction.options.getSubcommand();
		let kolor = interaction.options.getString("kolor");
		try {
			let data = await inventory.findOne({ userId: interaction.member.id });
			if (akcja == "ekwipunek")
				if (!data || !data.kolory.length) return client.error(interaction, { description: "Nie posiadasz żadnych kolorów w ekwipunku!" });
				else return client.success(interaction, { description: `**Posiadane kolory:**\n${data.kolory.map((x) => `<@&${x}>`).join("\n")}` });
			else if (akcja == "zdejmij") {
				if (interaction.member.roles.cache.has(client.config.roles.inne.ekonomiaBlock)) return client.error(interaction, { description: "Najpier zakończ tranzakcję na rynku!" });
				if (!interaction.member.roles.cache.has(kolor)) return client.error(interaction, { description: `Nie posiadasz <@&${kolor}> w swoich rangach!` });
				if (data?.kolory.includes(kolor)) return client.error(interaction, { description: `Posiadasz już <@&${kolor}> w ekwipunku!` });

				interaction.member.roles.remove(kolor);

				if (!data) await inventory.create({ userId: interaction.member.id, kolory: [kolor], eventy: { sum: 0, list: [] }, zgadywanki: { literki: 0, emotki: 0 }, zgp: [], reputacja: { plus: [], minus: [] }, views: 0 });
				else {
					data.kolory.push(kolor);
					await data.save().catch((e) => console.log(e));
				}

				return client.success(interaction, { description: `Pomyślnie zdjęto kolor <@&${kolor}>.` });
			} else {
				if (interaction.member.roles.cache.has(kolor)) return client.error(interaction, { description: `Psiadasz już <@&${kolor}> w swoich rangach!` });
				if (!data?.kolory.includes(kolor)) return client.error(interaction, { description: `Nie posiadasz <@&${kolor}> w ekwipunku!` });

				interaction.member.roles.add(kolor);

				data.kolory.splice(data.kolory.indexOf(kolor), 1);
				await data.save().catch((e) => console.log(e));

				return client.success(interaction, { description: `Pomyślnie założono kolor <@&${kolor}>.` });
			}
		} catch (err) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
