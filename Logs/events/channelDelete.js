const config = require("../config/config.json");
const { AuditLogEvent } = require('discord.js');

module.exports = async (Discord, client, channel) => {
    if (channel.guild.id != config.horda) return;
    const entry = await channel.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelDelete }).then(audit => audit.entries.first())
	let logChanel = client.channels.cache.get(config.logi.mainChannel).threads.cache.get(config.logi.kanaly);
	if (!logChanel) return;

	let embed = new Discord.EmbedBuilder()
		.setAuthor({name: "Usuwanie kanału", iconURL: "https://cdn.discordapp.com/emojis/866943415988256798.png"})
		.setColor("Red")
		.addFields({ name: "Kanał", value: `\`${channel.name}\``, inline: true }, { name: "ID", value: `\`${channel.id}\``, inline: true }, {name: "Kategoria", value: `${channel.parentId ? `<#${channel.parentId}>`: "*`Brak`*"}`}, { name: "Typ", value: `\`${channel.type}\``, inline: true }, { name: "Usuwający/a", value: `${entry.executor}`, inline: true });
	logChanel.send({ embeds: [embed] });
}