const items = {
	"Kolor Seledynowy": { cena: 2500, roleId: "610109317978390529" },
	"Kolor Niebieski": { cena: 2500, roleId: "610109118622990358" },
	"Kolor Fioletowy": { cena: 2500, roleId: "610109462472032301" },
	"Kolor Różowy": { cena: 2500, roleId: "610109677610467338" },
	"Kolor Czarny": { cena: 2500, roleId: "610109826680225812" },
	"Kolor Biały": { cena: 2500, roleId: "610108895238553620" },
	"Kolor Szary": { cena: 3000, roleId: "918573932565626941" },
	"Kolor Miętowy": { cena: 3000, roleId: "918485413822345276" },
	"Kolor Kremowy": { cena: 3000, roleId: "918480597607907329" },
	"Kolor Złoty": { cena: 3000, roleId: "917868457624752179" },
	"Kolor Magenta": { cena: 3000, roleId: "917870502721237062" },
	"Kolor Purpurowy": { cena: 3000, roleId: "917869767333916732" },
	"Król Hazardu": { cena: 200000, roleId: "779701743125659700" },
	"Kapitałowy Gigant": { cena: 150000, roleId: "896353293050216449" },
	"Szejk": { cena: 100000, roleId: "610041045027258380" },
	"Własna rola": { cena: 100000, roleId: "609458624909017098" },
	"Upgrade rangi": { cena: 80000, roleId: "610038984520892430" },
	"Mistrz Ruletki": { cena: 80000, roleId: "610040851527368721" },
	"Cashmaker": { cena: 60000, roleId: "610040288710230016" },
	"Człowiek Pokera": { cena: 50000, roleId: "779432784405856267" },
	"Milioner": { cena: 35000, roleId: "610040002013036545" },
	"Inwestor": { cena: 20000, roleId: "610040621025198080" },
	"Kanał Prywatny": { cena: 17500, roleId: "610038854526828544" },
	"Bogacz": { cena: 10000, roleId: "610040479635079211" },
	"Dodatkowe Sloty": { cena: 10000, roleId: "740915712712900688" },
	"Los Platynowy": { cena: 5500, roleId: "973129545576230912" },
	"Los Diamentowy": { cena: 4250, roleId: "973128563064725535" },
	"Los Hazardowy": { cena: 3000, roleId: "973128820607553566" },
	"Los Premium": { cena: 2500, roleId: "973128361989771284" },
	"Los Zwykły": { cena: 1250, roleId: "973127703010107432" },
	"Zmiana Nickname": { cena: 1000, roleId: "610038594836365312" },
	"Podarunek": { cena: 700, roleId: "735473629705404525" },
	"Zdrapka": { cena: 500, roleId: "973177820484362261" },
};
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const wait = require("util").promisify(setTimeout);
const takNieCollector = require("../../../functions/util/takNieCollector");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("rynek")
		.setDescription("Komenda do sprzedawania/kupowania przedmiotów")
		.addSubcommand((sc) =>
			sc
				.setName("serwerowy")
				.setDescription("Sprzedawaj rangi na rynku serwerowym")
				.addIntegerOption((integer) => integer.setName("numer").setDescription("Numer przedmiotu, który chcesz sprezedać").setMinValue(1).setMaxValue(Object.keys(items).length))
		),
	cooldown: "10s",
	async execute(client, interaction) {
		const akcja = interaction.options.getSubcommand();
		const numer = interaction.options.getInteger("numer");
		try {
			let embed = new EmbedBuilder()
				.setTitle("Rynek")
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
				.setTimestamp()
				.setColor(client.config.embedHex);
			if (akcja == "serwerowy") {
				if (interaction.member.roles.cache.some((x) => client.config.roles.inne.ekoBlock.includes(x.id))) return client.error(interaction, { description: "Dokończ poprzedną tranzakcję!" });

				let posiadane = [];
				for (i in items) if (interaction.member.roles.cache.has(items[i].roleId)) posiadane.push({ name: i, id: items[i].roleId, price: items[i].cena / 2 });

				if (numer) {
					if (numer > posiadane.length) return client.error(interaction, { description: "Podano zły numer przedmiotu." });
					let sellItem = posiadane[numer - 1];
					interaction.member.roles.add(client.config.roles.inne.ekonomiaBlock);
					const row = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("takczynie-tak").setEmoji("<:yes:942751104662396948>").setStyle("Success"), new ButtonBuilder().setCustomId("takczynie-nie").setEmoji("<:no:942751104708538419>").setStyle("Danger")]);
					const pytanie = await interaction.editReply({ embeds: [embed.setDescription(`Czy napewno chcesz sprzedać: \`${sellItem.name}\`\nOtrzymasz: \`${sellItem.price}\`<:konopcoin:866344767192825906>`)], components: [row] });
					if (await takNieCollector(interaction, pytanie, row, 10)) {
						interaction.member.roles.remove(sellItem.id);
						interaction.editReply({ embeds: [embed.setDescription(`Poprawnie sprzedano <@&${sellItem.id}> za ${sellItem.price}<:konopcoin:866344767192825906>`).setColor("Green")], components: [] });
						let msg = await client.channels.cache.get(client.config.channels.bot_traffic).send({ content: `${interaction.member} bank ${sellItem.price} Sprzedaż na rynku: \`${sellItem.name}\`` });
						client.unbelieva
							.editUserBalance(client.config.servers.hordaId, interaction.member.id, { bank: sellItem.price }, `Sprzedaż na rynku: ${sellItem.name}`)
							.then(() => msg.react("✅"))
							.catch((e) => msg.react("❌"));
					} else interaction.editReply({ embeds: [embed.setDescription("Wstrzymano kupno!").setColor("Red")], components: [] });
					await wait(1500);
					interaction.member.roles.remove(client.config.roles.inne.ekonomiaBlock);
				} else return interaction.editReply({ embeds: [embed.setDescription(`**Przedmioty, które możesz sprzedać:**\n${posiadane.length ? posiadane.map((x, i) => `\`${i + 1}.\` \`${x.name}\` za ${x.price.toLocaleString()}<:konopcoin:866344767192825906>`).join("\n") : "*`Brak`*"}`).setFooter({ text: "Aby sprzedać przedmiot wpisz: /rynek serwerowy <numer przedmiotu>" })] });
			} // TODO: ten świeszny rynek użytkowników co w mojej opini jest bez sensu
		} catch (err) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
