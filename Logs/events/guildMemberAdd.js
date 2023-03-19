const config = require("../config/config.json");
const Discord = require("discord.js");

module.exports = async (Discord, client, member) => {
	if (member.guild.id != config.horda) return;
	let logChanel = client.channels.cache.get(config.logi.mainChannel).threads.cache.get(config.logi.wejscieWyjscie);
	if (!logChanel) return;

	let embed = new Discord.EmbedBuilder()
		.setColor("Green")
		.setTitle("Nowy użytkownik")
		.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
		.setDescription(`${member} \`[${member.user.tag}]\` właśnie wbił/a na serwer!`)
		.addFields({ name: "ID", value: `${member.id}`, inline: true }, { name: "Konto utworzono", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:f> - <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }, { name: "Teraz użytkowników", value: `**${member.guild.memberCount.toLocaleString()}**` });
	logChanel.send({ embeds: [embed] });

	//Powitalnia (embed)
	const powitalnia = client.channels.cache.get("603310554227933200");
	let difference = 0;
	const msg = await powitalnia.messages.fetch({ limit: 1 });
	difference = member.guild.memberCount - Number(msg.first().embeds[0].fields[1].value.match(/\d{5,6}/));

	const powitalniaEmbed = new Discord.EmbedBuilder()
		.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
		.setColor("Green")
		.setDescription(`Witaj <@${member.id}>!`)
		.addFields({ name: "・Konto utworzono:", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:f>`, inline: true }, { name: "・Liczba użytkowników:", value: `${member.guild.memberCount} ${difference == 0 || difference == 1 || difference == -1 ? "" : `${difference > 0 ? `(+${difference})` : `(${difference})`}`}`, inline: true })
		.setTimestamp();

	client.channels.cache.get("603310554227933200").send({ embeds: [powitalniaEmbed] });
};
