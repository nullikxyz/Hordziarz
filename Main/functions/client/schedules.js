const { EmbedBuilder } = require("discord.js");
const moment = require("moment-timezone");
const fs = require("fs");

const { removeUrlop } = require("./urlopy");
const { zagadkiStart } = require("../economy/zagadki");

const zagadkiAktywneModel = require("../../models/messageCollector");
const glosoweModel = require("../../models/kanaly_glosowe");
const urlopModel = require("../../models/urlopy");

async function cooldown(client) {
	for (let i in client.cooldowns) {
		for (let command in client.cooldowns[i]) {
			const check = client.cooldowns[i][command] - Date.now();

			if (check < 0) delete client.cooldowns[i][command];
		}
		if (!Object.values(client.cooldowns[i]).length) delete client.cooldowns[i];
	}

	fs.writeFileSync("./Main/json/cooldowns.json", JSON.stringify(client.cooldowns, null, 4));
}

async function statystyki(client) {
	const guild = client.guilds.cache.get(client.config.servers.hordaId);

	let users = 0,
		self_muted = 0,
		self_deafened = 0,
		server_muted = 0,
		server_deafened = 0;

	guild.channels.cache
		.filter((x) => x.type == 2)
		.forEach((ch) => {
			if (ch.members) {
				ch.members.forEach((m) => {
					if (m.voice.selfMute) self_muted++;
					if (m.voice.selfDeaf) self_deafened++;
					if (m.voice.serverMute) server_muted++;
					if (m.voice.serverDeaf) server_deafened++;
					users++;
				});
			}
		});

	guild.channels.cache
		.get(client.config.statystyki.channelId)
		.messages.fetch(client.config.statystyki.messageId)
		.then((msg) =>
			msg.edit({
				embeds: [
					new EmbedBuilder()
						.setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
						.addFields([
							{
								name: "• Użytkownicy:",
								value: `• Łącznie: **${guild.memberCount}**\n• Online: **${guild.members.cache.filter((member) => member.presence?.status != "offline").size}**`,
								inline: true,
							},
							{
								name: "• Kanały:",
								value: `• <:text:899378031129403452> **${guild.channels.cache.filter((ch) => ch.type == 0).size}**\n• <:voice:899378031334932580> **${guild.channels.cache.filter((ch) => ch.type == 2).size}**\n• <:category:899378029279739954> **${guild.channels.cache.filter((ch) => ch.type == 4).size}**`,
								inline: true,
							},
							{
								name: "• Kanały głosowe:",
								value: `• <:online:899382367473532989> **${users}** (💤 **${guild.channels.cache.get("603327822542536748").members.size}**)\n• <:selfMute:899378029942411264> **${self_muted}** (<:serverMute:899378030789664778> **${server_muted}**)\n• <:selfDeaf:899378029560750120> **${self_deafened}** (<:serverDeaf:899378029942411267> **${server_deafened}**)`,
								inline: true,
							},
							{
								name: "• Emotki:",
								value: `• Ilość: **${guild.emojis.cache.size}**\n• Nieruchome: **${guild.emojis.cache.filter((e) => !e.animated).size}**\n• Animowane: **${guild.emojis.cache.filter((e) => e.animated).size}**`,
								inline: true,
							},
							{ name: "• Role:", value: `• Ilość: **${guild.roles.cache.size}**`, inline: true },
							{
								name: "• Boosty:",
								value: `• Poziom: **${guild.premiumTier}**\n• Ilość: **${guild.premiumSubscriptionCount}**`,
								inline: true,
							},
						])
						.setThumbnail(guild.iconURL())
						.setColor(0xc846ff)
						.setFooter({ text: "Ostatnia aktualizacja" })
						.setTimestamp(),
				],
			})
		);
}

async function urlopy(client) {
	const data = await urlopModel.find({ time: { $lt: Date.now() } });
	const guild = client.guilds.cache.get(client.config.servers.hordaId);

	for (d of data) {
		let member;
		try {
			member = await guild.members.fetch(d.userId);
			removeUrlop(client, member, client.user);
		} catch (error) {
			await urlopModel.findByIdAndRemove(d._id);
		}
	}
}

async function ekipa_discorda(client) {
	const guild = client.guilds.cache.get(client.config.servers.hordaId);
	let admin_roles = [];
	admin_roles = admin_roles.concat(Object.values(client.config.roles.adm), Object.values(client.config.roles.mod), client.config.roles.inne.urlop);
	let display = "";

	await guild.members.fetch();

	for (role of admin_roles) {
		let members = await guild.roles.resolve(role).members.filter((member) => member.roles.highest.id == role);
		if (members.size) display += `<@&${role}> [${members.size}]\n${members.map((m) => `・${m.user.tag.replace(/(\*|_|\x60|~|\|)/g, "\\$&")}`).join("\n")}\n\n`;
	}
	client.channels.cache
		.get(client.config.listaEkipa.channelId)
		.messages.fetch(client.config.listaEkipa.messageId)
		.then((msg) =>
			msg.edit({
				embeds: [
					new EmbedBuilder()
						.setAuthor({
							name: "Administracja serwera",
							iconURL: guild.iconURL(),
						})
						.setDescription(display)
						.setColor(0xc846ff)
						.setFooter({ text: "Ostatnia aktualizacja" })
						.setTimestamp(),
				],
			})
		);
}

async function kanaly_prywatne(client) {
	const gdata = await glosoweModel.find();
	for (kanal of gdata) if (!client.channels.resolve(kanal.channelId)) await glosoweModel.findOneAndRemove({ channelId: kanal.channelId });
}

function teczowy(client) {
	let randomColor = Math.floor(Math.random() * 16777215).toString(16);
	while (randomColor.length != 6) randomColor = "0" + randomColor;

	client.guilds.cache.get(client.config.servers.hordaId).roles.cache.get(client.config.roles.inne.teczowa).setColor(`#${randomColor}`);
}

async function zagadki(client) {
	let hour = Number(moment(Date.now()).tz("Europe/Warsaw").format("kk"));
	if (hour > 8 && hour < 24) {
		let kanal = client.channels.resolve("603307919504703524");
		let czySa = await zagadkiAktywneModel.findOne({ channelId: kanal.id });

		let typ = ["literki", "emotki", "emotki" /*"literki", "literki", "literki", "literki"*/];
		if (!czySa) zagadkiStart(client, typ[Math.floor(Math.random() * typ.length)], kanal);
	}
	let random = Math.floor(Math.random() * (135 - 105) + 105) * 60 * 1000;
	setTimeout(() => zagadki(client), random);
}

module.exports = {
	cooldown,
	statystyki,
	urlopy,
	ekipa_discorda,
	kanaly_prywatne,
	teczowy,
	zagadki,
};
