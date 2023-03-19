const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const kalendarzModel = require("../../../models/adwent");
const moment = require("moment-timezone");

module.exports = {
	data: new SlashCommandBuilder().setName("adwent").setDescription("Otwórz kolejne okienko w kalendarzu!"),
	hidden: true,
	async execute(client, interaction) {
		try {
			const nowMonth = Number(moment(Date.now()).tz("Europe/Warsaw").format("MM"));
			const nowDay = Number(moment(Date.now()).tz("Europe/Warsaw").format("DD"));

			if (nowMonth != 12 || nowDay > 24) return client.error(interaction, { description: "Adwentu teraz nie ma!" });

			const [todayGift] = await Promise.all([kalendarzModel.findOne({ day: nowDay })]);

			if (todayGift.received.includes(interaction.member.id)) return client.error(interaction, { description: "Odebrałeś/aś już dzisiejszą nagrodę!" });

			let desc = nowDay == 24 ? "**To już dziś!\nWesołych Świąt i szczęśliwego Nowego Roku życzy Administracja serwera `⭐HORDA KONOPA⭐` <3**" : `**Miłego ${nowDay}. dnia adwentowego :) Zostało już tylko \`${24 - nowDay}\` dni do** ***Świąt Bożego Narodzenia!***\n**Nie zapomnij wrócić do nas jutro, by odebrać NOWE prezenty :D**`;

			let msg = await interaction.member
				.send({
					embeds: [new EmbedBuilder().setDescription(desc).setThumbnail("https://i.imgur.com/QzMCHfJ.png").setColor("Red"), new EmbedBuilder().setColor("Red").setImage(todayGift.img || "https://cdn.discordapp.com/attachments/1029354484381528146/1042535945662111754/image_1.png")],
					components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setDisabled(true).setCustomId("server").setStyle("Secondary").setLabel(interaction.guild.name)])],
				})
				.catch((e) => {
					return false;
				});
			if (!msg) return client.error(interaction, { description: "Aby otworzyc kalendarz adwentowy musisz miec włączone wiadomości prywatne z serwera." }); // Można to wywalic ale jest żeby ludzie nie płakali że nie wiedzą co jest i że nie wiedzą co dostali

			await Promise.all([kalendarzModel.updateOne({ day: nowDay }, { $push: { received: interaction.member.id } }), givePrize(client, interaction, todayGift.prize)]);
			client.success(interaction, { description: `Zobacz wiadomości prywatne od <@${client.user.id}> aby dowiedzieć się jaka była dzisiejsza niespodzianka!` });
		} catch (err) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
async function givePrize(client, interaction, prize) {
	if (!prize.split("+").length) return;
	for (n of prize.split("+")) {
		n = n.trim();
		if (await interaction.guild.roles.resolve(n)) {
			interaction.member.roles.add(n);
			continue;
		} else if (Number.isInteger(Number(n))) {
			let msg = await client.channels.cache.get(client.config.channels.bot_traffic).send({ content: `${interaction.member} bank ${n} Prezent adwentowy` });
			client.unbelieva
				.editUserBalance(client.config.servers.hordaId, interaction.member.id, { bank: n }, `Prezent adwentowy`)
				.then(() => msg.react("✅"))
				.catch((e) => msg.react("❌"));
			continue;
		} else continue;
	}
}
