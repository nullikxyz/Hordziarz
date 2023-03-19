const config = require("../config/config.json");
const { AuditLogEvent } = require('discord.js');

module.exports = async (Discord, client, emoji) => {
	if (emoji.guild.id != config.horda) return;
	let logChanel = client.channels.cache.get(config.logi.mainChannel).threads.cache.get(config.logi.emotki);
	if (!logChanel) return;

	const entry = await emoji.guild.fetchAuditLogs({ type: AuditLogEvent.EmojiUpdate }).then(audit => audit.entries.first())

	let embed = new Discord.EmbedBuilder()
		.setAuthor({name: "Usuwanie emotki", iconURL: "https://cdn.discordapp.com/emojis/866943415090413589.png"})
		.setColor("Red")
        .setThumbnail(emoji.url)
		.addFields({ name: "Nazwa", value: `\`${emoji.name}\``, inline: true }, { name: "ID", value: `\`${emoji.id}\``, inline: true }, { name: "Animowana", value: `\`${emoji.animated ? "Tak" : "Nie"}\``, inline: true }, { name: "Osoba usuwająca", value: `${entry.executor}`, inline: true });
	logChanel.send({ embeds: [embed] });
};
