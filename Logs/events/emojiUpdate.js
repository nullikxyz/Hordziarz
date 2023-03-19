const config = require("../config/config.json");
const { AuditLogEvent } = require('discord.js');

module.exports = async (Discord, client, oldEmoji, newEmoji) => {
	if (newEmoji.guild.id != config.horda) return;
	const entry = await oldEmoji.guild.fetchAuditLogs({ type: AuditLogEvent.EmojiUpdate }).then(audit => audit.entries.first())
	if (oldEmoji.name == newEmoji.name) return;
	let logChanel = client.channels.cache.get(config.logi.mainChannel).threads.cache.get(config.logi.emotki);
	if (!logChanel) return;

	let autor = await entry.target.fetchAuthor()
	let embed = new Discord.EmbedBuilder()
		.setAuthor({name: "Edycja emotki", iconURL: "https://cdn.discordapp.com/emojis/866943416343461891.png"})
		.setColor("Blue")
		.addFields({ name: "Emotka", value: `${newEmoji}`, inline: true }, { name: "Stara nazwa", value: `\`${oldEmoji.name}\``, inline: true }, { name: "Nowa nazwa", value: `\`${newEmoji.name}\``, inline: true }, { name: "Osoba edytująca", value: `${entry.executor}`, inline: true }, { name: "Twórca emotki", value: `${autor}`, inline: true });
	logChanel.send({ embeds: [embed] });
};
