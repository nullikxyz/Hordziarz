const { ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const rangi = require("../../../models/rangi_prywatne");
const { info, sloty, kolor, ikona } = require("../../../functions/economy/rangiPrywatne");
const { checkCooldown, getCooldown } = require("../../../functions/client/cooldown");
const takNieCollector = require("../../../functions/util/takNieCollector");
const staticImg = require("../../../functions/util/staticImg");
const hd = require("../../../functions/time/humanizeDuration");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ranga")
		.setDescription("Komenda do zarządzania rangą prywatną.")
		.addSubcommandGroup((scg) =>
			scg
				.setName("admin")
				.setDescription("Tylko dla administracji")
				.addSubcommand((sc) => sc.setName("lista").setDescription("Lista rang prywatnych"))
				.addSubcommand((sc) =>
					sc
						.setName("informacje")
						.setDescription("Uzyskaj informacje o danej randze prywatnej.")
						.addRoleOption((role) => role.setName("ranga").setDescription("O jakiej randze chcesz zdobyć informacje.").setRequired(true))
				)
				.addSubcommand((sc) =>
					sc
						.setName("usuń")
						.setDescription("Usuwa rangę prywatną.")
						.addRoleOption((role) => role.setName("ranga").setDescription("Jaką rangę chcesz usunąć.").setRequired(true))
				)
				.addSubcommand((sc) =>
					sc
						.setName("sloty")
						.setDescription("Ustawai ilość dostępnych slotów.")
						.addRoleOption((role) => role.setName("ranga").setDescription("Jakiej randze chcesz ustawic sloty.").setRequired(true))
						.addIntegerOption((integer) => integer.setName("sloty").setDescription("Na ile slotów mam ustawić.").setMinValue(1).setRequired(true))
				)
				.addSubcommand((sc) =>
					sc
						.setName("kolor")
						.setDescription("Zmienia kolor randze.")
						.addRoleOption((role) => role.setName("ranga").setDescription("Jakiej randze chcesz zmienić kolor.").setRequired(true))
						.addStringOption((string) => string.setName("kolor").setDescription("Nowy kolor rangi.").setRequired(true))
				)
				.addSubcommand((sc) =>
					sc
						.setName("ikona")
						.setDescription("Zmienia ikonę randze.")
						.addRoleOption((role) => role.setName("ranga").setDescription("Jakiej randze chcesz zmienić ikonę.").setRequired(true))
						.addAttachmentOption((attachment) => attachment.setName("ikona").setDescription("Nowa ikona rangi.").setRequired(true))
				)
				.addSubcommand((sc) =>
					sc
						.setName("nadaj")
						.setDescription("Nadaje rangę użytkownikowi.")
						.addRoleOption((role) => role.setName("ranga").setDescription("Jaką range chcesz nadać.").setRequired(true))
						.addUserOption((user) => user.setName("osoba").setDescription("Osoba, której chcesz nadać rangę.").setRequired(true))
				)
				.addSubcommand((sc) =>
					sc
						.setName("zabierz")
						.setDescription("Zabiera rangę użytkownikowi.")
						.addRoleOption((role) => role.setName("ranga").setDescription("Jaką rangę chcesz zabrać.").setRequired(true))
						.addUserOption((user) => user.setName("osoba").setDescription("Osoba, której chcesz zabrać rangę.").setRequired(true))
				)
		)
		.addSubcommand((sc) => sc.setName("informacje").setDescription("Uzyskaj informacje o swojej randze."))
		.addSubcommand((sc) => sc.setName("utwórz").setDescription("Tworzy rangę prywatną."))
		.addSubcommand((sc) => sc.setName("sloty").setDescription("Dodaje sloty do rangi prywatnej."))
		.addSubcommand((sc) =>
			sc
				.setName("kolor")
				.setDescription("Zmienia kolor randze.")
				.addStringOption((string) => string.setName("kolor").setDescription("Nowy kolor rangi.").setRequired(true))
		)
		.addSubcommand((sc) =>
			sc
				.setName("ikona")
				.setDescription("Zmienia ikonę randze.")
				.addAttachmentOption((attachment) => attachment.setName("ikona").setDescription("Nowa ikona rangi.").setRequired(true))
		)
		.addSubcommand((sc) =>
			sc
				.setName("nadaj")
				.setDescription("Nadaje rangę użytkownikowi.")
				.addUserOption((user) => user.setName("osoba").setDescription("Osoba, której chcesz nadać rangę.").setRequired(true))
		)
		.addSubcommand((sc) =>
			sc
				.setName("zabierz")
				.setDescription("Zabiera rangę użytkownikowi.")
				.addUserOption((user) => user.setName("osoba").setDescription("Osoba, której chcesz zabrać rangę.").setRequired(true))
		),
	async execute(client, interaction) {
		let akcja = interaction.options.getSubcommand();
		let ifAdmin = interaction.options._group;
		let acceptChannel = interaction.guild.channels.cache.get(client.config.channels.zgloszenia);
		try {
			let pytanieEmbed = new EmbedBuilder()
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
				.setColor(client.config.embedHex)
				.setFooter({ text: interaction.member.id })
				.setTimestamp();

			if (ifAdmin && !interaction.member.roles.cache.some((x) => Object.values(client.config.roles.adm).includes(x.id))) return client.error(interaction, { description: "Nie jesteś w administracji serwera!" });
			let rangaData = await rangi.findOne({ ownerId: interaction.member.id });
			if (ifAdmin) rangaData = await rangi.findOne({ roleId: interaction.options.getRole("ranga")?.id });
			if (akcja == "lista") {
				let listaRang = await rangi.find();
				if (!listaRang.length) return client.error(interaction, { description: "<:no:942751104708538419> Żaden użytkownik nie posaiada aktualnie rangi prywatnej." });
				let embedFields = [];
				for (let r of listaRang) {
					let member;
					try {
						member = await interaction.guild.members.fetch(r.ownerId);
					} catch (error) {
						embedFields.push({ name: `Zbanowany/Wyszedł [${r.ownerId}]`, value: ` <:koxkropa:936236511844790342> **Właściciel:** <@${r.ownerId}> \`[${r.ownerId}]\`\n <:koxkropa:936236511844790342> **Ranga:** <@&${r.roleId}> \`[${r.roleId}]\`\n <:koxkropa:936236511844790342> **Sloty:** ${r.posiadacze.length}/${r.slots}` });
						continue;
					}
					embedFields.push({ name: `${member?.user.tag} [${r.ownerId}]`, value: ` <:koxkropa:936236511844790342> **Właściciel:** ${member} \`[${member?.user.tag}]\`\n <:koxkropa:936236511844790342> **Ranga:** <@&${r.roleId}> \`[${r.roleId}]\`\n <:koxkropa:936236511844790342> **Sloty:** ${r.posiadacze.length}/${r.slots}` });
				}
				return client.success(interaction, { description: "**Rangi prywatne**", fields: embedFields });
			} else if (akcja == "utwórz") {
				if (rangaData) return client.error(interaction, { description: `Posiadasz już range prywatną: <@&${rangaData.roleId}>` });
				if (!interaction.member.roles.cache.has(client.config.prywatneRangi.nowa)) return client.error(interaction, { description: `Aby to zrobić musisz posiadać rangę: <@&${client.config.prywatneRangi.nowa}>` });
				interaction.member.roles.remove(client.config.prywatneRangi.nowa);
				acceptChannel.send({
					embeds: [pytanieEmbed.setDescription(`Użytkownik ${interaction.member} prosi o utworzenie rangi prywatnej.`)],
					components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("ranga-utworz").setEmoji("<:yes:942751104662396948>").setStyle("Success").setLabel("Akceptuj"), new ButtonBuilder().setCustomId("ranga-odrzuc").setEmoji("<:no:942751104708538419>").setStyle("Danger").setLabel("Odrzuć")])],
				});
				return client.success(interaction, { description: "Twoja prośba o utworzenie rangi prywatnej została wysłana do administracji. Wkrótce otrzymasz wiadomość prywatną od bota z odpowiedzią." });
			} else {
				if (!rangaData) return client.error(interaction, { description: ifAdmin ? "Podana ranga nie jest rangą prywatną" : "Nie jesteś właścicielem żadnej rangi prywatnej." });

				let target = interaction.options.getMember("osoba");
				if (akcja == "informacje") return info(client, interaction, rangaData);
				else if (akcja == "usuń") {
					let rangaDel = interaction.guild.roles.cache.get(rangaData.roleId);
					const row = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("takczynie-tak").setEmoji("<:yes:942751104662396948>").setStyle("Success"), new ButtonBuilder().setCustomId("takczynie-nie").setEmoji("<:no:942751104708538419>").setStyle("Danger")]);
					const pytanie = await interaction.editReply({
						embeds: [
							new EmbedBuilder()
								.setTitle("Rangi prywatne")
								.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
								.setTimestamp()
								.setColor("Red")
								.setDescription(`Czy napewno chcesz usunąć rangę: ${rangaDel}?`),
						],
						components: [row],
					});
					if (await takNieCollector(interaction, pytanie, row, 10)) {
						client.success(interaction, { description: "Usuwanie <a:LoadingWin11:912288215073951776>" });
						client.channels.cache
							.get(client.config.channels.logiMain)
							.threads.cache.get(client.config.prywatneRangi.thread)
							?.send({
								embeds: [
									new EmbedBuilder()
										.setTitle("Ranga prywatna")
										.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
										.setColor(client.config.embedHex)
										.setDescription(`${interaction.member} Usunął/ęła rangę: \`[${rangaDel.name}]\` należącą do <@${rangaData.ownerId}>`),
								],
							});
						await rangaDel.delete().catch((e) => console.log(e));
						await rangi.findByIdAndRemove(rangaData._id);
						return client.success(interaction, { description: `Poprawnie usunięto rangę należącą do: <@${rangaData.ownerId}>` });
					} else return client.error(interaction, { description: "Wstrzymano usuwanie!" });
				} else if (akcja == "sloty") {
					let slots = interaction.options.getInteger("sloty");
					if (!slots && !interaction.member.roles.cache.has(client.config.prywatneRangi.slot)) return client.error(interaction, { description: `Aby to zrobić musisz posiadać rangę: <@&${client.config.prywatneRangi.slot}>` });
					interaction.member.roles.remove(client.config.prywatneRangi.slot);

					return sloty(client, interaction, rangaData, slots);
				} else if (akcja == "kolor") {
					let color = interaction.options.getString("kolor");
					if (!ifAdmin && !interaction.member.roles.cache.has(client.config.prywatneRangi.upgrade) && !rangaData.color) return client.error(interaction, { description: `Aby to zrobić musisz posiadać rangę: <@&${client.config.prywatneRangi.upgrade}>` });

					if (!color.match(/[A-Fa-f0-9]{6}/)) return client.error(interaction, { description: "Podano błędny kolor hex *([Przykładowy generator kolorów](https://www.color-hex.com/color-wheel/))*" });
					if (ifAdmin) {
						kolor(client, interaction, rangaData, color.match(/[A-Fa-f0-9]{6}/)[0], true);
						return client.success(interaction, { description: `Zmieniono kolor <@&${rangaData.roleId}> na \`#${color}\`` });
					} else {
						if (rangaData.akcja) return client.error(interaction, { description: "Wysłałeś już zapytanie o edycję rangi!" });
						if (await checkCooldown(client, interaction.member.id, "rangi-kolorZmiana")) return client.error(interaction, { description: `Ponowna zmiana koloru dostępna za: \`${hd((await getCooldown(client, interaction.member.id, "rangi-kolorZmiana")) - Date.now())}\`` });

						interaction.member.roles.remove(client.config.prywatneRangi.upgrade);
						rangaData.akcja = `kolor-${color.match(/[A-Fa-f0-9]{6}/)[0]}`;
						await rangaData.save().catch((e) => console.log(e));
						client.success(interaction, { description: "Twoja prośba o zmianę koloru rangi prywatnej została wysłana do administracji. Wkrótce otrzymasz wiadomość prywatną od bota z odpowiedzią." });
						acceptChannel.send({
							embeds: [pytanieEmbed.setDescription(`Użytkownik ${interaction.member} prosi o zmiane koloru rangi prywatnej na: \`#${color.match(/[A-Za-z0-9]{6}/)[0]}\``).setThumbnail(`https://dummyimage.com/400x400/${color.match(/[A-Za-z0-9]{6}/)[0]}/${color.match(/[A-Za-z0-9]{6}/)[0]}`)],
							components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("ranga-kolor").setEmoji("<:yes:942751104662396948>").setStyle("Success").setLabel("Akceptuj"), new ButtonBuilder().setCustomId("ranga-odrzuc").setEmoji("<:no:942751104708538419>").setStyle("Danger").setLabel("Odrzuć")])],
						});
					}
				} else if (akcja == "ikona") {
					let icon = interaction.options.getAttachment("ikona");
					if (!ifAdmin && !interaction.member.roles.cache.has(client.config.prywatneRangi.upgrade) && !rangaData.icon) return client.error(interaction, { description: `Aby to zrobić musisz posiadać rangę: <@&${client.config.prywatneRangi.upgrade}>` });
					if (icon.contentType != "image/jpeg" && icon.contentType != "image/png") return client.error(interaction, { description: "Błędne rozszerzenie pliku! Poprawne: `png/jpg/jpeg`." });
					if (icon.size > 240000) return client.error(interaction, { description: "Rozmiar pliku nie może przekraczać `240 KB`" });

					icon = (await staticImg(client, [icon], `Prośba o zmiane ikony rangi prywatnej <@${rangaData.ownerId}>`))[0];
					if (ifAdmin) {
						ikona(client, interaction, rangaData, icon, true);
						return client.success(interaction, { description: "Zmieniono ikonę rangi" });
					} else {
						if (rangaData.akcja) return client.error(interaction, { description: "Wysłałeś już zapytanie o edycję rangi!" });
						if (await checkCooldown(client, interaction.member.id, "rangi-ikonaZmiana")) return client.error(interaction, { description: `Ponowna zmiana ikony dostępna za: \`${hd((await getCooldown(client, interaction.member.id, "rangi-ikonaZmiana")) - Date.now())}\`` });

						interaction.member.roles.remove(client.config.prywatneRangi.upgrade);
						rangaData.akcja = `ikona-${icon}`;
						await rangaData.save().catch((e) => console.log(e));
						client.success(interaction, { description: "Twoja prośba o zmianę koloru rangi prywatnej została wysłana do administracji. Wkrótce otrzymasz wiadomość prywatną od bota z odpowiedzią." });
						acceptChannel.send({
							embeds: [pytanieEmbed.setDescription(`Użytkownik ${interaction.member} prosi o zmiane ikony rangi prywatnej.`).setThumbnail(icon)],
							components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("ranga-ikona").setEmoji("<:yes:942751104662396948>").setStyle("Success").setLabel("Akceptuj"), new ButtonBuilder().setCustomId("ranga-odrzuc").setEmoji("<:no:942751104708538419>").setStyle("Danger").setLabel("Odrzuć")])],
						});
					}
				} else if (akcja == "nadaj") {
					if (rangaData.posiadacze.includes(target.id)) return client.error(interaction, { description: `${target} posiada już <@&${rangaData.roleId}>` });
					if (rangaData.slots <= rangaData.posiadacze.length) return client.error(interaction, { description: "Osiągnięto maksymalną ilość osób rangi. Aby dodać kolejne osoby zwiększ liczbę miejsc `/ranga sloty`!" });

					rangaData.posiadacze.push(target.id);
					rangaData.save().catch((e) => console.log(e));
					target.roles.add(rangaData.roleId);

					return client.success(interaction, { description: `Poprawnie nadano rangę <@&${rangaData.roleId}> użytkownikowi ${target}` });
				} else if (akcja == "zabierz") {
					if (!rangaData.posiadacze.includes(target.id)) return client.error(interaction, { description: `${target} nie posiada <@&${rangaData.roleId}>` });

					rangaData.posiadacze.splice(rangaData.posiadacze.indexOf(target.id), 1);
					rangaData.save().catch((e) => console.log(e));
					target.roles.remove(rangaData.roleId);

					return client.success(interaction, { description: `Poprawnie zabrano rangę <@&${rangaData.roleId}> użytkownikowi ${target}` });
				}
			}
		} catch (err) {
			console.log(err);
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
