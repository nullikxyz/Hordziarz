const { EmbedBuilder } = require("discord.js");
const rangiShema = require("../../models/rangi_prywatne");
const mongoose = require("mongoose");

let infoEmbed = new EmbedBuilder().setTitle("Zmiana w rangach prywatnych.").setTimestamp().setColor("#ee2a7b");

async function info(client, interaction, ranga) {
	let embed = new EmbedBuilder()
		.setTitle("Ranga prywatna")
		.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
		.setColor(client.config.embedHex);

	if (ranga.icon) embed.setThumbnail(ranga.icon);
	return interaction.editReply({
		embeds: [
			embed.addFields([
				{ name: "Ranga", value: `<@&${ranga.roleId}> \`[${ranga.roleId}]\`` },
				{ name: "Właściciel", value: `<@${ranga.ownerId}> \`[${ranga.ownerId}]\`` },
				{ name: "Kolor", value: `\`${ranga.color ? `#${ranga.color}` : "Brak"}\`` },
				{ name: "Ikonka", value: `\`${ranga.icon ? "W thumbnail" : "Brak"}\`` },
				{ name: "Sloty", value: `\`${ranga.posiadacze.length}/${ranga.slots}\`` },
				{ name: "Podiadacze", value: `<@${ranga.posiadacze.join("> • <@")}>` },
			]),
		],
	});
}
async function sloty(client, interaction, ranga, slots) {
	if (slots) ranga.slots = slots;
	else ranga.slots += ranga.slots == 3 ? 2 : 1;
	await ranga.save().catch((e) => console.log(e));
	client.success(interaction, { description: `Poprawnie ustawiono ilość slotów na: \`${ranga.slots}\`` });

	client.channels.cache
		.get(client.config.channels.logiMain)
		.threads.cache.get(client.config.prywatneRangi.thread)
		?.send({ embeds: [infoEmbed.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) }).setDescription(`${interaction.member} zmienił ilość slotów <@&${ranga.roleId}> na \`${ranga.slots}\`.`)] });
}

async function kolor(client, interaction, ranga, kolor, self = false) {
	interaction.guild.roles.cache.get(ranga.roleId).edit({ color: kolor });

	ranga.color = interaction.guild.roles.cache.get(ranga.roleId).color;
	ranga.akcja = null;
	await ranga.save().catch((e) => console.log(e));

	self
		? client.channels.cache
				.get(client.config.channels.logiMain)
				.threads.cache.get(client.config.prywatneRangi.thread)
				?.send({ embeds: [infoEmbed.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) }).setDescription(`${interaction.member} zmienił kolor <@&${ranga.roleId}> na \`#${kolor}\`.`)] })
		: "";
}
async function ikona(client, interaction, ranga, ikona, self = false) {
	let ifIkona = await interaction.guild.roles.cache
		.get(ranga.roleId)
		.edit({ icon: ikona })
		.catch((e) => {
			interaction.channel.send({
				embeds: [
					infoEmbed
						.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
						.setDescription("Błąd zmiany ikony!")
						.setThumbnail(ikona),
				],
			});
			return false;
		});

	if (!ifIkona) return;

	ranga.icon = ikona;
	ranga.akcja = null;
	await ranga.save().catch((e) => console.log(e));

	self
		? client.channels.cache
				.get(client.config.channels.logiMain)
				.threads.cache.get(client.config.prywatneRangi.thread)
				?.send({
					embeds: [
						infoEmbed
							.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
							.setDescription(`${interaction.member} zmienił ikonę <@&${ranga.roleId}>.`)
							.setThumbnail(ikona),
					],
				})
		: "";
}
module.exports = {
	info,
	sloty,
	kolor,
	ikona,
};
