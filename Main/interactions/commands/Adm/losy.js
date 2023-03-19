const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const takNieCollector = require("../../../functions/util/takNieCollector");
const losyModel = require("../../../models/losy");
const staticImg = require("../../../functions/util/staticImg");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("losy")
		.setDescription("Komenda do zarządzania losami.")
		.addSubcommand((sc) => sc.setName("lista").setDescription("Lista aktualnych losów."))
		.addSubcommand((sc) =>
			sc
				.setName("info")
				.setDescription("Informacje o konkretnym losie.")
				.addStringOption((string) => string.setName("los").setDescription("Podaj nazwę losu, o którym chcesz dowiedzieć się więcej.").setRequired(true))
		)
		.addSubcommand((sc) =>
			sc
				.setName("usuń")
				.setDescription("Usuwa los.")
				.addStringOption((string) => string.setName("los").setDescription("Podaj nazwę losu, który chcesz usunąć.").setRequired(true))
		)
		.addSubcommand((sc) =>
			sc
				.setName("dodaj")
				.setDescription("Dodaje los.")
				.addStringOption((string) => string.setName("nazwa").setDescription("Nazwa nowego losu").setRequired(true))
				.addStringOption((string) => string.setName("wyzwalacz").setDescription("Jaka wiadomość ma wyzwalać uzycie losu.").setRequired(true))
				.addStringOption((string) => string.setName("nagrody").setDescription("Nagrody rozdzielone ','. Jeżeli chcesz dać 2 lub więcej nagród do jednego numerka rodziel je '+'.").setRequired(true))
				.addStringOption((string) => string.setName("cooldown").setDescription("Jakie ma być opóźnienie między użyciem losu.").setRequired(true))
				.addRoleOption((role) => role.setName("ranga").setDescription("Jaka ranga jest wymagana to użycia losu. Ranga zostanie zabrana po wykorzystaniu.").setRequired(true))
				.addStringOption((string) => string.setName("bonus").setDescription("Bonus za wylosowanie poprawnego numerka."))
				.addStringOption((string) => string.setName("kolor").setDescription("Kolor embeda przy otwieraniu losu."))
				.addAttachmentOption((attachment) => attachment.setName("ikona").setDescription("Ikona w embedzie przy otwieraniu losu."))
		)
		.addSubcommandGroup((scg) =>
			scg
				.setName("edytuj")
				.setDescription("Edytuje poszczególne parametry losów.")
				.addSubcommand((sc) =>
					sc
						.setName("nazwa")
						.setDescription("Nazwa losu.")
						.addStringOption((string) => string.setName("los").setDescription("Podaj nazwę losu, który chcesz edytować.").setRequired(true))
						.addStringOption((string) => string.setName("nazwa").setDescription("Nowa nazwa losu").setRequired(true))
				)
				.addSubcommand((sc) =>
					sc
						.setName("wyzwalacz")
						.setDescription("Wyzwalacz losu.")
						.addStringOption((string) => string.setName("los").setDescription("Podaj nazwę losu, który chcesz usunąć.").setRequired(true))
						.addStringOption((string) => string.setName("wyzwalacz").setDescription("Nowy wyzwalacz losu").setRequired(true))
				)
				.addSubcommand((sc) =>
					sc
						.setName("nagrody")
						.setDescription("Nagrody losu.")
						.addStringOption((string) => string.setName("los").setDescription("Podaj nazwę losu, który chcesz usunąć.").setRequired(true))
						.addStringOption((string) => string.setName("nagrody").setDescription("Nowe nagrody losu").setRequired(true))
				)
				.addSubcommand((sc) =>
					sc
						.setName("bonus")
						.setDescription("Bonus los")
						.addStringOption((string) => string.setName("los").setDescription("Podaj nazwę losu, który chcesz usunąć.").setRequired(true))
						.addStringOption((string) => string.setName("bonus").setDescription("Nowy bonus losu"))
				)
				.addSubcommand((sc) =>
					sc
						.setName("cooldown")
						.setDescription("Cooldown losu.")
						.addStringOption((string) => string.setName("los").setDescription("Podaj nazwę losu, który chcesz usunąć.").setRequired(true))
						.addStringOption((string) => string.setName("cooldown").setDescription("Nowy cooldown losu").setRequired(true))
				)
				.addSubcommand((sc) =>
					sc
						.setName("ranga")
						.setDescription("Ranga losu.")
						.addStringOption((string) => string.setName("los").setDescription("Podaj nazwę losu, który chcesz usunąć.").setRequired(true))
						.addRoleOption((role) => role.setName("ranga").setDescription("Nowa ranga losu").setRequired(true))
				)
				.addSubcommand((sc) =>
					sc
						.setName("kolor")
						.setDescription("Kolor losu.")
						.addStringOption((string) => string.setName("los").setDescription("Podaj nazwę losu, który chcesz usunąć.").setRequired(true))
						.addStringOption((string) => string.setName("kolor").setDescription("Nowy kolor losu").setRequired(true))
				)
				.addSubcommand((sc) =>
					sc
						.setName("ikona")
						.setDescription("Ikona losu.")
						.addStringOption((string) => string.setName("los").setDescription("Podaj nazwę losu, który chcesz usunąć.").setRequired(true))
						.addAttachmentOption((attachment) => attachment.setName("ikona").setDescription("Nowa ikona losu").setRequired(true))
				)

				.addSubcommand((sc) =>
					sc
						.setName("stan")
						.setDescription("Stan losu włączony/wyłączony..")
						.addStringOption((string) => string.setName("los").setDescription("Podaj nazwę losu, który chcesz usunąć.").setRequired(true))
				)
				.addSubcommand((sc) =>
					sc
						.setName("kanał")
						.setDescription("Lista kanałów, na których można uzywać losu.")
						.addStringOption((string) => string.setName("los").setDescription("Podaj nazwę losu, który chcesz usunąć.").setRequired(true))
						.addIntegerOption((integer) => integer.setName("akcja").setDescription("Dodać czy usunąć kanał z listy.").addChoices({ name: "dodaj", value: 1 }, { name: "usuń", value: 0 }).setRequired(true))
						.addChannelOption((channel) => channel.setName("kanał").setDescription("Kanał, który dodać/usunąć z listy").addChannelTypes(0).setRequired(true))
				)
		),
	async execute(client, interaction) {
		try {
			let akcja = interaction.options.getSubcommand();
			let losName = interaction.options.getString("los");
			let losyData = await losyModel.find({});
			let tenLos;
			if (losName) {
				tenLos = losyData.filter((x) => x.name === losName)[0];
				if (!tenLos) return client.error(interaction, { description: `Nie mogę znaleźć losu o nazwie: \`${losName}\`` });
			}
			let nazwa = interaction.options.getString("nazwa");
			let wyzwalacz = interaction.options.getString("wyzwalacz");
			let cooldown = interaction.options.getString("cooldown");
			let kolor = interaction.options.getString("kolor");
			let ikona = interaction.options.getAttachment("ikona");
			let nagrody = interaction.options.getString("nagrody")?.split(",");
			let bonus = interaction.options.getString("bonus");
			let ranga = interaction.options.getRole("ranga")?.id;
			let kanal = interaction.options.getChannel("kanał")?.id;

			if (interaction.options.getSubcommandGroup() == "edytuj") {
				switch (akcja) {
					case "nazwa":
						if (losyData.some((x) => x.name == nazwa)) return client.error(interaction, { description: "Jeden z losów posiada już taką nazwę!" });
						else {
							tenLos.name = nazwa;
							await Promise.all([losyModel.findByIdAndUpdate(tenLos._id, { name: nazwa }), client.losy.set(tenLos.trigger, tenLos)]);
							return client.success(interaction, { description: "Pomyślnie zmieniono nazwę losu" });
						}
					case "wyzwalacz":
						if (losyData.some((x) => x.trigger == wyzwalacz)) return client.error(interaction, { description: "Jeden z losów posiada już taki wyzwalacz!" });
						else {
							tenLos.trigger = wyzwalacz;
							await Promise.all([client.losy.delete(tenLos.trigger), client.losy.set(wyzwalacz, tenLos), losyModel.findByIdAndUpdate(tenLos._id, { trigger: wyzwalacz })]);
							return client.success(interaction, { description: "Pomyślnie zmieniono wyzwalacz losu" });
						}

					case "nagrody":
						if (nagrody.length <= 1) return client.error(interaction, { description: "Musisz podać conajmniej 2 nagrody." });
						else {
							for (x of nagrody) nagrody[nagrody.indexOf(x)] = x.replace(/ +/, "", 1).replace(/[<@&>]/g, "");
							tenLos.prizes = nagrody;
							await Promise.all([losyModel.findByIdAndUpdate(tenLos._id, { prizes: nagrody }), client.losy.set(tenLos.trigger, tenLos)]);
							return client.success(interaction, { description: "Pomyślnie zmieniono nagrody." });
						}

					case "bonus":
						bonus?.replace(/ +/, "", 1).replace(/[<@&>]/g, "");
						tenLos.bonus = bonus;
						await Promise.all([losyModel.findByIdAndUpdate(tenLos._id, { bonus: bonus }), client.losy.set(tenLos.trigger, tenLos)]);
						return client.success(interaction, { description: "Pomyślnie zmieniono bonus." });

					case "cooldown":
						if (!cooldown.match(/\d+(y|mo|w|d|h|m|s)/gi)) return client.error(interaction, { description: "Podano błędny cooldown" });
						else {
							tenLos.cooldown = cooldown;
							await Promise.all([losyModel.findByIdAndUpdate(tenLos._id, { cooldown: cooldown }), client.losy.set(tenLos.trigger, tenLos)]);
							return client.success(interaction, { description: "Pomyślnie ustawiono nowy cooldown." });
						}

					case "ranga":
						tenLos.roleId = ranga;
						await Promise.all([losyModel.findByIdAndUpdate(tenLos._id, { roleId: ranga }), client.losy.set(tenLos.trigger, tenLos)]);
						return client.success(interaction, { description: "Pomyślnie zmieniono range losu." });

					case "kolor":
						if (!kolor.match(/[a-fA-F0-9]{6}/)) return client.error(interaction, { description: "Podano błędny kolor!" });
						tenLos.color = kolor;
						await Promise.all([losyModel.findByIdAndUpdate(tenLos._id, { color: kolor }), client.losy.set(tenLos.trigger, tenLos)]);
						return client.success(interaction, { description: "Pomyślnie zmieniono kolor losu." });

					case "ikona":
						if (ikona?.contentType != "image/jpeg" && ikona?.contentType != "image/png") return client.error(interaction, { description: "Poprawne rozszerzenie pliku to: png/jpg/jpeg" });
						let iconUrl = (await staticImg(client, [ikona], `Nowa ikona do \`${tenLos.name}\``))[0];
						tenLos.icon = iconUrl;
						await Promise.all([losyModel.findByIdAndUpdate(tenLos._id, { icon: iconUrl }), client.losy.set(tenLos.trigger, tenLos)]);
						return client.success(interaction, { description: "Pomyślnie zmieniono ikone losu." });

					case "stan":
						tenLos.enabled = !tenLos.enabled;
						await Promise.all([losyModel.findByIdAndUpdate(tenLos._id, { enabled: tenLos.enabled }), client.losy.set(tenLos.trigger, tenLos)]);
						return client.success(interaction, { description: `Pomyślnie ${tenLos.enabled ? "włączono" : "wyłączono"} los.` });

					case "kanał":
						if (interaction.options.getInteger("akcja")) {
							if (tenLos.channels.includes(kanal)) return client.error(interaction, { description: "Ten kanał jest już na liście." });
							tenLos.channels.push(kanal);
							await Promise.all([losyModel.findByIdAndUpdate(tenLos._id, { $push: { channels: kanal } }), client.losy.set(tenLos.trigger, tenLos)]);
							return client.success(interaction, { description: "Pomyślnie dodano kanał do listy kanałów, na których można uzywać losu." });
						} else {
							if (!tenLos.channels.includes(kanal)) return client.error(interaction, { description: "Tego kanału nie ma na liście." });
							tenLos.channels.splice(tenLos.channels.indexOf(kanal), 1);
							await Promise.all([losyModel.findByIdAndUpdate(tenLos._id, { $pull: { channels: kanal } }), client.losy.set(tenLos.trigger, tenLos)]);
							return client.success(interaction, { description: "Pomyślnie usunięto kanał z listy kanałów, na których można uzywać losu." });
						}

					default:
						break;
				}
			} else if (akcja == "lista")
				return client.success(interaction, {
					description: `**Lista losów**\n${
						losyData.length
							? losyData
									.sort((a, b) => a.name.length - b.name.length)
									.sort((a, b) => b.enabled - a.enabled)
									.map((x) => `${x.enabled ? "<:icons_on:860499265947959326>" : "<:icons_off:860499265289191434>"} \`${x.name}\``)
									.join("\n")
							: "*`Brak`*"
					}`,
				});
			else if (akcja == "info") {
				let toLongPrize = printPrize(interaction, tenLos.prizes).length > 1024;

				let infoEmbed = new EmbedBuilder()
					.setTitle("Losy")
					.addFields([
						{ name: "Nazwa", value: `\`${tenLos.name}\``, inline: true },
						{ name: "Wyzwalacz", value: `\`${tenLos.trigger}\``, inline: true },
						{ name: "Ikona", value: `${tenLos.icon ? "`W thumbnailu`" : "`Brak`"}` },
						{ name: "Cooldown", value: `\`${tenLos.cooldown}\``, inline: true },
						{ name: "Ranga", value: `<@&${tenLos.roleId}>`, inline: true },
						{ name: "Stan", value: `${tenLos.enabled ? "<:icons_on:860499265947959326>" : "<:icons_off:860499265289191434>"}`, inline: true },
						{ name: "Nagrody", value: `${toLongPrize ? "`W osobnym embedzie`" : printPrize(interaction, tenLos.prizes)}` },
						{ name: "Bonusowa nagroda", value: `${printPrize(interaction, [tenLos.bonus])}` },
						{ name: "Włączone kanał", value: `${tenLos.channels ? `<#${tenLos.channels.join(">, <#")}>` : "*`Brak`*"}` },
					])
					.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
					.setColor(tenLos.color ?? client.config.embedHex);
				if (tenLos.icon) infoEmbed.setThumbnail(tenLos.icon);
				let embedList = [infoEmbed];

				if (toLongPrize)
					embedList.push(
						new EmbedBuilder()
							.setColor(tenLos.color ?? client.config.embedHex)
							.setTitle("Nagrody")
							.setDescription(printPrize(interaction, tenLos.prizes))
					);

				return interaction.editReply({ embeds: embedList });
			} else if (akcja == "usuń") {
				let msg = await interaction.editReply({
					embeds: [
						new EmbedBuilder()
							.setTitle("Losy")
							.setColor("Red")
							.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
							.setDescription(`**UWAGA** Czy napewno chcesz usunąć los: \`${tenLos.name}\`?`),
					],
					components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("takczynie-tak").setStyle("Success").setEmoji("<:yes:942751104662396948>"), new ButtonBuilder().setCustomId("takczynie-nie").setStyle("Danger").setEmoji("<:no:942751104708538419>")])],
				});
				if (await takNieCollector(interaction, msg)) {
					await client.losy.delete(tenLos.trigger);
					await losyModel.findByIdAndRemove(tenLos._id);
					return client.success(interaction, { description: "Poprawnie usunięto los." });
				} else return client.error(interaction, { description: "Wstrzymano usuwanie losu." });
			} else if (akcja == "dodaj") {
				let err = "";
				if (losyData.some((x) => x.name == nazwa)) return client.error(interaction, { description: "Jeden z losów posiada już taką nazwę!" });
				if (losyData.some((x) => x.trigger == wyzwalacz)) return client.error(interaction, { description: "Jeden z losów posiada już taki wyzwalacz!" });
				if (wyzwalacz.split(" ").length != 1) return client.error(interaction, { description: "Wyzwalacz musi byc 1 wyrazem!" });
				if (!cooldown.match(/\d+(y|mo|w|d|h|m|s)/gi)) {
					cooldown = "1h";
					err += `Podano błędny cooldown. Ustawiono na domyślny czyli: \`${cooldown}\`\n`;
				}
				if (!kolor || !kolor.match(/[0-9a-zA-Z]{6}/)) {
					kolor = client.config.embedHex;
					err += `Ustawiono kolor na: \`${kolor}\`\n`;
				}
				if (!ikona || (ikona?.contentType != "image/jpeg" && ikona?.contentType != "image/png")) {
					ikona = null;
					err += "Ustawiono ikonę na: `Brak`";
				} else ikona = (await staticImg(client, [ikona], `Ikona dla \`${nazwa}\``))[0];

				if (nagrody.length <= 1) return client.error(interaction, { description: "Musisz podać conajmniej 2 nagrody." });
				for (x of nagrody) nagrody[nagrody.indexOf(x)] = x.replace(/ +/, "", 1).replace(/[<@&>]/g, "");

				bonus?.replace(/ +/, "").replace(/[<@&>]/g, "", 1);

				let nLos = await losyModel.create({
					name: nazwa,
					color: kolor,
					icon: ikona,
					roleId: ranga,
					trigger: wyzwalacz,
					prizes: nagrody,
					cooldown: cooldown,
					bonus: bonus,
					channels: interaction.channel.id,
					enabled: true,
				});
				client.losy.set(nLos.trigger, nLos);
				client.success(interaction, { description: `Dodano los. Błędy:\n${err.length ? err : "*`Brak`*"}` });
			}
		} catch (err) {
			console.log(err);
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};

function printPrize(interaction, arr) {
	let string = "";
	let nr = 1;
	if (!arr?.length || arr[0] == null) return "*`Brak`*";
	for (x of arr) {
		let multi = [];
		for (n of x.split("+")) {
			n = n.trim();
			if (interaction.guild.roles.cache.get(n)) multi.push(`<@&${n}>`);
			else if (Number.isInteger(Number(n))) multi.push(`\`${n}\`<:konopcoin:866344767192825906>`);
			else multi.push(`\`${n}\``);
		}
		string += `**${nr}** <:kropka:934196471601963049> ${multi.join(" + ")}\n`;
		nr++;
	}
	return string;
}
