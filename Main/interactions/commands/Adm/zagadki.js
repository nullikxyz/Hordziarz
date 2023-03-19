const fs = require("fs");
const { SlashCommandBuilder } = require("@discordjs/builders");
const zagadkiAktywneModel = require("../../../models/messageCollector");
const zagadkiModel = require("../../../models/zagadki");
const { zagadkiStart, zagadkiEnd } = require("../../../functions/economy/zagadki");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("zagadki")
		.setDescription("Komenda do zarządzania zagadkami.")
		.addSubcommandGroup((scg) =>
			scg
				.setName("literki")
				.setDescription("Zagadki pomieszane literki.")
				.addSubcommand((sc) =>
					sc
						.setName("dodaj")
						.setDescription("Dodaje słowo do listy.")
						.addStringOption((string) => string.setName("hasło").setDescription("Słowo jakie chcesz dodać.").setRequired(true))
				)
				.addSubcommand((sc) =>
					sc
						.setName("usuń")
						.setDescription("Usuwa słowo z listy.")
						.addStringOption((string) => string.setName("hasło").setDescription("Słowo jakie chcesz usunąć.").setRequired(true))
				)
				.addSubcommand((sc) => sc.setName("lista").setDescription("Wyświetla liste słów."))
				.addSubcommand((sc) =>
					sc
						.setName("start")
						.setDescription("Rozpoczyna zgadywanki na podanym kanale.")
						.addChannelOption((channel) => channel.setName("kanał").setDescription("Kanał, na którym ma sie rozpocząć zgadywanie.").addChannelTypes(0).setRequired(true))
				)
				.addSubcommand((sc) =>
					sc
						.setName("stop")
						.setDescription("Kończy zgadywanki na podanym kanale.")
						.addChannelOption((channel) => channel.setName("kanał").setDescription("Kanał, na którym ma sie zakończyć zgadywanie.").addChannelTypes(0).setRequired(true))
				)
		)
		.addSubcommandGroup((scg) =>
			scg
				.setName("emotki")
				.setDescription("Zagadki zaszyfrowane emotki.")
				.addSubcommand((sc) =>
					sc
						.setName("dodaj")
						.setDescription("Dodaje słowo do listy.")
						.addStringOption((string) => string.setName("emotki").setDescription("Zaszyfrowane emotki.").setRequired(true))
						.addStringOption((string) => string.setName("kategoria").setDescription("Kategoria hasła.").setRequired(true))
						.addStringOption((string) => string.setName("hasło").setDescription("Co te zaszyfrowane emotki oznaczają (hasła opcjonalne rozdzielać ;).").setRequired(true))
				)
				.addSubcommand((sc) =>
					sc
						.setName("usuń")
						.setDescription("Usuwa słowo z listy.")
						.addStringOption((string) => string.setName("hasło").setDescription("Słowo jakie chcesz usunąć.").setRequired(true))
				)
				.addSubcommand((sc) => sc.setName("lista").setDescription("Wyświetla liste słów."))
				.addSubcommand((sc) =>
					sc
						.setName("start")
						.setDescription("Rozpoczyna zgadywanki na podanym kanale.")
						.addChannelOption((channel) => channel.setName("kanał").setDescription("Kanał, na którym ma sie rozpocząć zgadywanie.").addChannelTypes(0).setRequired(true))
				)
				.addSubcommand((sc) =>
					sc
						.setName("stop")
						.setDescription("Kończy zgadywanki na podanym kanale.")
						.addChannelOption((channel) => channel.setName("kanał").setDescription("Kanał, na którym ma sie zakończyć zgadywanie.").addChannelTypes(0).setRequired(true))
				)
		),
	async execute(client, interaction) {
		let akcja = interaction.options.getSubcommand();
		let group = interaction.options.getSubcommandGroup();
		try {
			let haslo = interaction.options.getString("hasło");
			let channel = interaction.options.getChannel("kanał");

			switch (akcja) {
				case "dodaj":
					let emotki = interaction.options.getString("emotki") || "";
					let kategoria = interaction.options.getString("kategoria");

					if (group == "literki") {
						emotki = haslo.split(";")[0].split(" ");
						for (const wyraz of emotki) {
							if (wyraz.length < 2) return client.error(interaction, { description: "<:no:942751104708538419> Wyraz musi mieć min. 2 lietry" });
							let arr = [];
							for (l of wyraz.split("")) if (!arr.includes(l)) arr.push(l);
							if (arr.length == 1) return client.error(interaction, { description: "<:no:942751104708538419> Wyraz nie może zawierać tylko jednego znaku." });
							while (wyraz == emotki[emotki.indexOf(wyraz)]) {
								emotki[emotki.indexOf(wyraz)] = wyraz
									.split("")
									.sort((a, b) => 0.5 - Math.random())
									.join("");
							}
						}
						let content = emotki.map((word) => {
							let chars = word.split(""),
								emojis = "";
							for (let i in chars)
								if (chars[i].match(/[a-z]/i)) emojis += `:regional_indicator_${chars[i].toLowerCase()}: `;
								else emojis += chars[i].toUpperCase();

							return emojis;
						});
						emotki = content.join("\n");
					}

					await zagadkiModel.create({
						type: group,
						category: kategoria,
						correct: haslo.split(";")[0],
						aliases: haslo.split(";").slice(1) || [],
						emotes: emotki,
					});

					client.success(interaction, { description: `Poprawnie dodano hasło \`${haslo.split(";")[0]}\` (${emotki}) do listy ${group}` });
					break;

				case "usuń":
					let delHaslo = await zagadkiModel.findOne({ type: group, correct: haslo });
					if (!delHaslo) return client.error(interaction, { description: `<:no:942751104708538419> Nie mogę znaleźć takiego hasła w ${group}` });
					await zagadkiModel.findByIdAndRemove(delHaslo._id);
					client.success(interaction, { description: `Poprawnie usunięto hasło \`${delHaslo.correct}\`` });
					break;

				case "lista":
					let displayLista = await zagadkiModel.find({ type: group });
					fs.writeFileSync("./Main/inne/zagadkiLista.txt", displayLista.length ? `Liczba zagadek: ${displayLista.length}\n\n${displayLista.map((x, i) => `${i + 1}. ${x.emotes}  -  ${x.correct}`).join("\n")}` : "Brak haseł");
					interaction.editReply({ files: [{ attachment: "./Main/inne/zagadkiLista.txt", name: `lista-zagadki-${group}.txt` }] });
					client.success(interaction, { description: `Lista z obecnymi hasłami do \`${group}\`` });
					break;

				case "start":
					if (await zagadkiAktywneModel.findOne({ channelId: channel.id })) return client.error(interaction, { description: "Zagadki na tym kanale już trwają!" });

					let listaHasel = await zagadkiModel.find({ type: group });
					if (!listaHasel.length) return client.error(interaction, { description: "Brak haseł!" });

					zagadkiStart(client, group, channel);
					client.success(interaction, { description: `Rozpoczęto grę na: ${channel}` });
					break;

				case "stop":
					let zagadka = await zagadkiAktywneModel.findOne({ channelId: channel.id, type: "zagadki-emotkowe" });
					if (!zagadka) return client.error(interaction, { description: "Brak aktywnych zagadek na tym kanale!" });

					zagadkiEnd(client, zagadka.value, channel, null);
					client.success(interaction, { description: `Zakończono zagadki z kanału ${channel}` });
					break;

				default:
					client.logger.error("Tej opcji nie było");
					client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później!" });
					break;
			}
		} catch (err) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
