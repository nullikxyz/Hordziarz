const config = require("../config/config.json");
const { AuditLogEvent } = require('discord.js');

module.exports = async (Discord, client, channel) => {
    if (channel.guild.id != config.horda) return;
    const entry = await channel.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelCreate }).then(audit => audit.entries.first())

	let logChanel = client.channels.cache.get(config.logi.mainChannel).threads.cache.get(config.logi.kanaly);
	if (!logChanel) return;

	let embed = new Discord.EmbedBuilder()
		.setAuthor({name: "Tworzenie kanału", iconURL: "https://cdn.discordapp.com/emojis/866943416251973672.png"})
		.setColor("Green")
		.addFields({ name: "Kanał", value: `${channel}`, inline: true }, { name: "Nazwa", value: `\`${channel.name}\``, inline: true }, { name: "ID", value: `\`${channel.id}\``, inline: true }, {name: "Kategoria", value: `${channel.parentId ? `<#${channel.parentId}>`: "*`Brak`*"}`}, { name: "Typ", value: `\`${config.channelType[entry.changes.find(x => x.key == "type").new.toString()]}\``, inline: true }, { name: "Twórca", value: `${entry.executor}`, inline: true });
	logChanel.send({ embeds: [embed] });
}