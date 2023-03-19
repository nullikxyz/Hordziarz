const config = require("../config/config.json");
const { AuditLogEvent } = require('discord.js');

module.exports = async (Discord, client, oldChannel, newChannel) => {
	if (newChannel.guild.id != config.horda) return;
	const entry = await newChannel.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelUpdate }).then((audit) => audit.entries.first());
	let logChanel = client.channels.cache.get(config.logi.mainChannel).threads.cache.get(config.logi.kanaly);
	if (!logChanel) return;

	let stare = "",
		nowe = "";
	if (entry.target.id != newChannel.id && (oldChannel.parentId == newChannel.parentId || oldChannel.permissionOverwrites.cache == newChannel.permissionOverwrites.cache)) return;
	else if (oldChannel.parentId != newChannel.parentId) {
		stare += `Kategoria: <#${oldChannel.parentId}>\n`;
		nowe += `Kategoria: <#${newChannel.parentId}>\n`;
	} else
		for (z of entry.changes) {
			switch (z.key) {
				case "name":
				case "topic":
				case "bitrate":
				case "rtc_region":
				case "user_limit":
					stare += `${config.channelChangeKey[z.key]}: \`${z.old}\`\n`;
					nowe += `${config.channelChangeKey[z.key]}: \`${z.new}\`\n`;
					break;
				case "type":
					stare += `Typ: \`${config.channelType[z.old.toString()]}\`\n`;
					nowe += `Typ: \`${config.channelType[z.new.toString()]}\`\n`;
					break;
				case "nsfw":
					stare += `NSFW: \`${z.old ? "Tak" : "Nie"}\`\n`;
					nowe += `NSFW: \`${z.new ? "Tak" : "Nie"}\`\n`;
					break;
				case "default_auto_archive_duration":
					stare += `Domyślny czas archiwizacji wątków: \`${z.old ? `${z.old / 60}h` : "*`Brak`*"}\`\n`;
					nowe += `Domyślny czas archiwizacji wątków: \`${z.new ? `${z.new / 60}h` : "*`Brak`*"}\`\n`;
					break;
				case "video_quality_mode":
					stare += `Jakość obrazu: \`${z.old || z.old == 1 ? "Dostosowana do użytkownika" : "720p"}\`\n`;
					nowe += `Jakość obrazu: \`${z.new || z.new == 1 ? "Dostosowana do użytkownika" : "720p"}\`\n`;
					break;

				default:
                    stare += `${config.channelChangeKey[z.key]}: \`${z.old}\`\n`;
					nowe += `${config.channelChangeKey[z.key]}: \`${z.new}\`\n`;
					break;
			}
		}

	let embed = new Discord.EmbedBuilder()
		.setAuthor({ name: "Edycja kanału", iconURL: "https://cdn.discordapp.com/emojis/866943415136026674.png" })
		.setColor("Blue")
		.addFields({ name: "Kanał", value: `${newChannel}`, inline: true }, { name: "ID", value: `\`${newChannel.id}\`` }, { name: "Stare", value: `${stare}`, inline: true }, { name: "Nowe", value: `${nowe}`, inline: true }, { name: "Edytujący/a", value: `${entry.executor}` });
	logChanel.send({ embeds: [embed] });
};
