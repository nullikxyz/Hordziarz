const { EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const profilModel = require("../../models/profil");

module.exports = {
	name: "rankingi",
	async execute(client, interaction) {
		try {
			await interaction.deferReply({ ephemeral: true })
			let [repPlus, repMinus, zgadywankiLiterki, zgadywankiEmotki, eventyLista] = await Promise.all([
				profilModel.aggregate([
					{
						$project: {
							userId: 1,
							count: { $size: "$reputacja.plus" },
						},
					},
					{ $sort: { count: -1, userId: 1 } },
					{ $limit: 10 },
				]),
				profilModel.aggregate([
					{
						$project: {
							userId: 1,
							count: { $size: "$reputacja.minus" },
						},
					},
					{ $sort: { count: -1, userId: 1 } },
					{ $limit: 10 },
				]),
				profilModel.find({}).sort({ "zgadywanki.literki": -1 }).limit(10),
				profilModel.find({}).sort({ "zgadywanki.emotki": -1 }).limit(10),
				profilModel.find({}).sort({ "eventy.sum": -1 }).limit(10),
			]);
			let reputacjaRank = new EmbedBuilder().setColor(client.config.embedHex).addFields([
				{ name: "`POZYTYWNE` <:repplus:971106576322691112>", value: `\u200b\n${repPlus.map((x, i) => `\`${i + 1}.\` <@${x.userId}> - ${x.count}`).join("\n")}`, inline: true },
				{ name: "`NEGATYWNE` <:repminus:971106576356220968>", value: `\u200b\n${repMinus.map((x, i) => `\`${i + 1}.\` <@${x.userId}> - ${x.count}`).join("\n")}`, inline: true },
			]);

			let zgadywankiRank = new EmbedBuilder().setColor(client.config.embedHex).addFields([
				{ name: "`EMOTKI` <:emotki:971106576331075614>", value: `\u200b\n${zgadywankiEmotki.map((x, i) => `\`${i + 1}.\` <@${x.userId}> - ${x.zgadywanki.emotki}`).join("\n")}`, inline: true },
				{ name: "`LITERKI` <:literki:971106576142323835>", value: `\u200b\n${zgadywankiLiterki.map((x, i) => `\`${i + 1}.\` <@${x.userId}> - ${x.zgadywanki.literki}`).join("\n")}`, inline: true },
			]);

			let eventyRank = new EmbedBuilder().setColor(client.config.embedHex).addFields([
				{ name: "`EVENTY` 🏅", value: `\u200b\n${eventyLista.map((x, i) => `\`${i + 1}.\` <@${x.userId}> - ${x.eventy.sum}`).join("\n")}`, inline: true },
				{ name: "\u200b", value: "<:pierwsze:971106576784056400> - 3 pkt ▪️ <:drugie:971106575932620834> - 2pkt ▪️ <:trzecie:971106576205250580> - 1 pkt" },
			]);

			interaction.editReply({ embeds: [reputacjaRank, zgadywankiRank, eventyRank] });
		} catch (e) {
			console.log(e);
		}
	},
};
