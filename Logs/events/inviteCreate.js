const config = require("../config/config.json");

module.exports = async (Discord, client, invite) => {
	if (invite.guild.id != config.horda) return;
	let logChanel = client.channels.cache.get(config.logi.mainChannel).threads.cache.get(config.logi.invite);
	if (!logChanel) return;

	let embed = new Discord.EmbedBuilder()
		.setColor("Green")
		.setAuthor({ name: "Tworzenie zaproszenia", iconURL: "https://cdn.discordapp.com/emojis/865572290065072128.webp" })
		.addFields(
			{ name: "Kod zaproszenia", value: `\`${invite.code}\``, inline: true },
			{ name: "Maksymalna ilość użyć", value: `\`${invite.maxUses ? invite.maxUses : "∞"}\``, inline: true },
			{ name: "Czas wygaśnięcia", value: `${invite.maxAge ? `<t:${Math.floor(Date.now() / 1000) + invite.maxAge}:R>` : "`∞`"}`, inline: true },
			{ name: "Tymczasowe członkostwo", value: `\`${invite.temporary ? "Tak" : "Nie"}\``, inline: true },
			{ name: "Twórca zaproszenia", value: `${invite.inviter} \`[${invite.inviter.tag}]\``, inline: true },
			{ name: "Kanał", value: `${invite.channel}`, inline: true }
		);
	logChanel.send({ embeds: [embed] });
};
