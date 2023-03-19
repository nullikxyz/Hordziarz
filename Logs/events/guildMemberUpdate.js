const config = require("../config/config.json");
const { AuditLogEvent } = require("discord.js");

module.exports = async (Discord, client, oldMember, newMember) => {
	if (newMember.guild.id != config.horda) return;
	let logChanel = client.channels.cache.get(config.logi.mainChannel).threads.cache.get(config.logi.role.user);
	if (!logChanel) return;

	if (newMember.nickname != oldMember.nickname) {
		let embedNick = new Discord.EmbedBuilder()
			.setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({ dynamic: true }) })
			.setColor("Blue")
			.setTitle("Zmiana nickname")
			.addFields({ name: "Stary nick", value: `${oldMember.nickname}`, inline: true }, { name: "Nowy nick", value: `${newMember.nickname}`, inline: true }, { name: "Osoba", value: `${newMember}`, inline: true });

		return logChanel.send({ embeds: [embedNick] });
	}

	const entry = await oldMember.guild.fetchAuditLogs({ type: AuditLogEvent.MemberRoleUpdate }).then((audit) => audit.entries.first());
	if (entry.target.id != newMember.id) return;

	if (!client.config.developers.includes(entry.executor?.id) && entry.changes[0].new?.some((x) => x.id == "997255478897811546")) return newMember.roles.remove("997255478897811546");
	let stare = oldMember.roles.cache
		.filter((x) => x.id != "236585785049088003")
		.sort((a, b) => b.position - a.position)
		.map((x) => x.id);

	let zmiana = entry.changes[0].new.map((x) => x.id);
	let embed = new Discord.EmbedBuilder()
		.setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({ dynamic: true }) })
		.setColor(entry.changes[0].key == "$add" ? "Green" : "Red")
		.setTitle(entry.changes[0].key == "$add" ? "Nadana ranga" : "Zabrana ranga")
		.setDescription(`**Rangi przed**\n${stare.map((x) => `<@&${x}>`).join("\n") || "*`Brak`*"}`)
		.addFields({ name: `${entry.changes[0].key == "$add" ? "Nowe" : "Zabrane"} rangi`, value: `<@&${zmiana.join("> • <@&")}>`, inline: true }, { name: "Osoba", value: `${newMember}`, inline: true }, { name: "Zmieniający/a", value: `${entry.executor}` });

	logChanel.send({ embeds: [embed] });

	if (entry.changes[0].key == "$add" && entry.changes[0].new.some((x) => x.id == "896645151882117120")) newMember.roles.add("610038594836365312");
	if (entry.changes[0].key == "$add" && entry.changes[0].new.some((x) => x.id == "896645270987751464")) newMember.roles.add("609458624909017098");
	if (entry.changes[0].key == "$add" && entry.changes[0].new.some((x) => x.id == "896645291795705866")) newMember.roles.add("918993451574525983");
};
