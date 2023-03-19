const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const profil = require("../../../models/profil");
const humanizeDuration = require("../../../functions/time/humanizeDuration");
const { checkCooldown, setCooldown, getCooldown } = require("../../../functions/client/cooldown");
const staticImg = require("../../../functions/util/staticImg");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("profil")
		.setDescription("Komenda do zarządzania swoimi kolorami")
		.addSubcommand((sc) =>
			sc
				.setName("wyświetl")
				.setDescription("Wyświetla profil danej osoby lub swój.")
				.addUserOption((user) => user.setName("osoba").setDescription("Osoba czyjej profil chcesz zobaczyć."))
		)
		.addSubcommand((sc) =>
			sc
				.setName("baner")
				.setDescription("Zarządzaj banerem swojego profilu.")
				.addAttachmentOption((attachment) => attachment.setName("baner").setDescription("Nowy baner profilu. (Nie dawaj nic aby usunąć)"))
		)
		.addSubcommand((sc) =>
			sc
				.setName("ulubieńcy")
				.setDescription("Dodaj lub usuń ulubieńców ze swojego profilu.")
				.addUserOption((user) => user.setName("ulubieniec").setDescription("Osoba, którą chcesz dodać lub usunąć do listy ulubieńców.").setRequired(true))
		),
	cooldown: "15s",
	async execute(client, interaction) {
		let akcja = interaction.options.getSubcommand();
		try {
			let target = interaction.options.getMember("osoba") || interaction.member;

			let dbProfile = await profil.findOne({ userId: target.id });
			if (!dbProfile) dbProfile = await profil.create({ userId: target.id, banner: null, ulubiency: [], kolory: [], eventy: { sum: 0, list: [] }, zgadywanki: { literki: 0, emotki: 0 }, zgp: [], reputacja: { plus: [], minus: [] }, views: 0 });

			if (akcja == "wyświetl") {
				let targetSortedRoles = target.roles.cache
					.filter((x) => x.id != interaction.guild.id)
					.sort((a, b) => b.position - a.position)
					.map((x) => `<@&${x.id}>`)
					.join("・");
				if (targetSortedRoles.length > 1020) targetSortedRoles = "*Za dużo aby wyświetlić wszystkie*";

				//let levelInfo = await getLevel(target);

				if (target.id != interaction.member.id) await profil.findOneAndUpdate({ userId: target.id }, { $inc: { views: 1 } });

				let userInfoEmbed = new EmbedBuilder()
					.setAuthor({ name: target.user.tag, iconURL: target.user.displayAvatarURL({ dynamic: true }) })
					.setColor(target.displayHexColor)
					.setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
					.addFields([
						{ name: "<:icons_Person:859388129932214292> Osoba", value: `${target} \`[${target.user.tag}]\``, inline: true },
						{ name: "<:icons_id:860133546102620190> ID", value: `${target.id}`, inline: true },
						{ name: "<:icons_edit:859388129625374720> Nick", value: `${target.nickname || "*Brak*"}` },
						{ name: "<:invite:942821977046024203> Dołączono na serwer", value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:f> - <t:${Math.floor(target.joinedTimestamp / 1000)}:R>`, inline: true },
						{ name: "<:icons_join:860487640720343071> Konto utworzono", value: `<t:${Math.floor(target.user.createdTimestamp / 1000)}:f> - <t:${Math.floor(target.user.createdTimestamp / 1000)}:R>`, inline: true },
						{ name: "<:icons_star:859388127880544296> Najwyższa ranga", value: `${target.roles.highest}` },
						{ name: `<:icons_list:860123643710537789> Wszystkie rangi (${target.roles.cache.size - 1})`, value: `${targetSortedRoles}`, inline: true },
					]);
				let memberInfoEmbed = new EmbedBuilder()

					.setImage(dbProfile.banner ?? "https://cdn.discordapp.com/attachments/780509819928313866/926156256492785744/invisible.png")
					.setColor(target.displayHexColor)
					.addFields([
						{ name: "<:icons_shine1:859424400959602718> Reputacja", value: `Ilość głosów: **${dbProfile.reputacja.plus.length + dbProfile.reputacja.minus.length}**\n───────────\n<:repplus:971106576322691112> **${dbProfile.reputacja.plus.length}**            <:repminus:971106576356220968> **${dbProfile.reputacja.minus.length}**\n───────────\n`, inline: true },
						{ name: "<:icons_question:860133545905225768> Zagadki", value: `Wygrane: **${dbProfile.zgadywanki.literki + dbProfile.zgadywanki.emotki}**\n───────────\n<:literki:971106576142323835> **${dbProfile.zgadywanki.literki}**            <:emotki:971106576331075614> **${dbProfile.zgadywanki.emotki}**\n───────────\n`, inline: true },
						{ name: "<:icons_awardcup:875395223419777085> Eventy", value: `Wzięto udział: **${dbProfile.eventy.list.length}**\n──────────────\n<:pierwsze:971106576784056400> **${dbProfile.eventy.list.filter((x) => x.miejsce == 1).length}**        <:drugie:971106575932620834> **${dbProfile.eventy.list.filter((x) => x.miejsce == 2).length}**        <:trzecie:971106576205250580> **${dbProfile.eventy.list.filter((x) => x.miejsce == 3).length}**\n──────────────`, inline: true },
						{ name: "<:icons_search:859424401723883560> Odwiedziny", value: `Wyświetlono: **${dbProfile.views + (target.id != interaction.member.id ? 1 : 0)}**` },
						{ name: "<:icons_friends:861852632767528970> Ulubieńcy", value: `${dbProfile.ulubiency.length ? dbProfile.ulubiency.map((x) => `<@${x}>`).join("・") : "*`Brak`*"}` },
						//{ name: "<:icons_upvote:909715386843430933> Level", value: `Poziom: **${levelInfo.level}**                            Pozycja: **#${levelInfo.position}**\nXP Łącznie: **${levelInfo.xp.toLocaleString()}**        XP do ${levelInfo.level + 1} poziomu: **${(levelInfo.detailed_xp[1] - levelInfo.detailed_xp[0]).toLocaleString()}**` },
					]);

				let przyciski = [new ButtonBuilder().setStyle("Secondary").setCustomId("rankingi").setEmoji("📊").setLabel("Ranking")];
				if (interaction.member.id != target.id)
					/*przyciski.unshift(new ButtonBuilder().setStyle("Secondary").setCustomId("asdasd").setLabel("Ulubieńcy").setEmoji("😎"), new ButtonBuilder().setStyle("Secondary").setCustomId("asdfgasd").setLabel("Baner").setEmoji("🖼️"));*/
					/*else*/ await przyciski.unshift(new ButtonBuilder().setStyle("Secondary").setCustomId(`reputacja-plus_${target.id}`).setEmoji("<:repplus:971106576322691112>").setLabel("Rep +"), new ButtonBuilder().setStyle("Secondary").setCustomId(`reputacja-minus_${target.id}`).setEmoji("<:repminus:971106576356220968>").setLabel("Rep -"));

				interaction.editReply({
					embeds: [userInfoEmbed, memberInfoEmbed],
					components: [new ActionRowBuilder().addComponents(przyciski)],
				});
			} else if (akcja == "baner") {
				let baner = interaction.options.getAttachment("baner");
				if (!interaction.member.roles.cache.some((x) => client.config.roles.textLvl.slice(2).includes(x.id)) && !interaction.member.roles.cache.some((x) => client.config.roles.voiceLvl.slice(2).includes(x.id))) return client.error(interaction, { description: "Musisz posiadać minimum 10 poziom aby zmieniać baner." });

				if (await checkCooldown(client, interaction.user.id, "profil-baner")) return client.error(interaction, { description: `Ponowna zmiana baneru dostepna będzie za: \`${humanizeDuration((await getCooldown(client, interaction.user.id, "profil-baner")) - Date.now())}\`` });
				if (dbProfile.banner == baner) return client.error(interaction, { description: "Nie masz już baneru" });
				if (baner && (baner.width / baner.height).toFixed(10) != "1.7777777778") return client.error(interaction, { description: "Proporcja baneru muszą wynosić `16:9`" });

				client.success(interaction, { description: "Zmiana baneru." });
				let bannerUrl = baner ? (await staticImg(client, [baner], `Nowy baner profilowy ${interaction.member}`))[0] : null;
				await profil.findByIdAndUpdate(dbProfile._id, { banner: bannerUrl });

				client.success(interaction, { description: "Poprawnie zmieniono baner profilu." });

				await setCooldown(client, interaction.user.id, "profil-baner", Date.now() + 3600000);
			} else if (akcja == "ulubieńcy") {
				let ulubieniec = interaction.options.getMember("ulubieniec");
				if (!ulubieniec) return client.error(interaction, { description: "Podanej osoby nie ma na serwerze!" });
				if (ulubieniec.id == interaction.member.id) return client.error(interaction, { description: "Nie możesz dodawac samego siebie do ulubieńców profilu." });
				let coRobi;
				if (dbProfile.ulubiency.includes(ulubieniec.id)) {
					coRobi = false;
					dbProfile.ulubiency.splice(dbProfile.ulubiency.indexOf(ulubieniec.id), 1);
				} else {
					if (dbProfile.ulubiency.length >= 5) return client.error(interaction, { description: "Osiągnięto maksymalną ilość ulubieńców w profilu (5)." });
					coRobi = true;
					dbProfile.ulubiency.push(ulubieniec.id);
				}
				await dbProfile.save().catch((e) => console.log(e));
				client.success(interaction, { description: `Poprawnie ${coRobi ? "dodano" : "usunięto"} ${ulubieniec} ${coRobi ? "do" : "z"} listy ulubieńców.` });
			}
		} catch (err) {
			console.log(err);
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
