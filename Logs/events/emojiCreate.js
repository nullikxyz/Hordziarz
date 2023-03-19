const config = require("../config/config.json");

module.exports = async (Discord, client, emoji) => {
	if (emoji.guild.id != config.horda) return;
	let logChanel = client.channels.cache.get(config.logi.mainChannel).threads.cache.get(config.logi.emotki);
	if (!logChanel) return;

	let author = await emoji.fetchAuthor();
	let embed = new Discord.EmbedBuilder()
		.setTitle({name: "Dodawanie emotki", iconURL: "https://cdn.discordapp.com/emojis/866943416474796062.png"})
		.setColor("Green")
		.addFields({ name: "Emotka", value: `${emoji}`, inline: true }, { name: "Nazwa", value: `\`${emoji.name}\``, inline: true }, { name: "ID", value: `\`${emoji.id}\``, inline: true }, { name: "Animowana", value: `\`${emoji.animated ? "Tak" : "Nie"}\``, inline: true }, { name: "Osoba dodająca", value: `${author}`, inline: true });
	logChanel.send({ embeds: [embed] });
};
