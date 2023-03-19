const humanizeDuration = require("../time/humanizeDuration");
const { EmbedBuilder } = require("discord.js");
const urlopy = require("../../models/urlopy");

async function removeUrlop(client, member, admin) {
	const data = await urlopy.findOne({ userId: member.id });
	if (!data) return;

	member.roles.remove(client.config.roles.inne.urlop);
	member.roles.add(client.config.roles.inne.kruczek);
	if (data.type == "nrm" && member.guild.members.me.roles.highest.position > member.guild.roles.cache.get(data.role)?.position) member.roles.add(data.role);

	await urlopy.findOneAndRemove({ userId: member.id });

	return client.channels.cache.get(client.config.channels.urlopy).send({
		embeds: [
			new EmbedBuilder()
				.setAuthor({ name: admin.tag, iconURL: admin.displayAvatarURL({ dynamic: true }) })
				.setDescription(`Urlop użytkownika <@${member.user.id}> \`[${member.user.tag}]\` dobiegł końca!`)
				.setTimestamp()
				.setColor(client.config.embedHex),
		],
	});
}

async function addUrlop(client, member, admin, duration, reason, type) {
	await urlopy.create({
		userId: member.id,
		time: Date.now() + duration,
		reason: reason,
		type: type,
		role: type == "nrm" ? member.roles.highest.id : null,
	});

	return client.channels.cache.get(client.config.channels.urlopy).send({
		embeds: [
			new EmbedBuilder()
				.setAuthor({ name: admin.tag, iconURL: admin.displayAvatarURL({ dynamic: true }) })
				.setDescription("Urlop został nadany!")
				.addFields([
					{ name: "Ekipowicz:", value: `<@${member.id}> \`[${member.user.tag}]\``, inline: true },
					{ name: "Długość:", value: humanizeDuration(duration), inline: true },
					{ name: "Powód:", value: reason, inline: true },
					{ name: "Typ:", value: type == "low" ? "Mniejsza aktywność" : "Zwykły", inline: true },
					{ name: "Nadano przez:", value: `<@${admin.id}> \`[${admin.tag}]\``, inline: true },
				])
				.setColor(client.config.embedHex)
				.setTimestamp(),
		],
	});
}

async function listUrlops(client, interaction) {
	const data = await urlopy.find();

	for (i of data)
		try {
			await interaction.guild.members.fetch(i.userId);
		} catch (error) {
			data.splice(data.indexOf(i), 1);
		}

	if (!data.length) client.error(interaction, { description: "Żaden ekipowicz nie jest na urlopie." });
	return client.success(interaction, { fields: data.map((x, i) => ({ name: `#${i + 1}・${interaction.guild.members.cache.get(x.userId).user.tag} - ${x.type == "nrm" ? "zwykły" : "mniejsza aktywność"}`, value: `<:koxkropa:945733624827883541> \`Powód:\` ${x.reason}\n<:koxkropa:945733624827883541> \`Koniec:\` <t:${Math.floor(x.time / 1000)}> <t:${Math.floor(x.time / 1000)}:R>${x.type == "nrm" ? `\n<:koxkropa:945733624827883541> \`Ranga:\` <@&${x.role}>` : ""}` })) });
}

module.exports = {
	removeUrlop,
	addUrlop,
	listUrlops,
};
