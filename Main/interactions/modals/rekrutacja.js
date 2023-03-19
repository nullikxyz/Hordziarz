const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const rekru = require("../../models/rekrutacja");
const inneData = require("../../models/inne");

module.exports = {
	name: "rekrutacja",
	async execute(client, interaction) {
		const podanie = interaction.fields.getTextInputValue("podanie");

		let row = new ActionRowBuilder().addComponents([new ButtonBuilder().setEmoji("<:yes:942751104662396948>").setCustomId("rekru-przyjete").setStyle("Success"), new ButtonBuilder().setEmoji("<:no:942751104708538419>").setCustomId("rekru-odrzucone").setStyle("Danger")]);
		interaction.guild.channels.cache
			.get(client.config.channels.rekrutacja)
			.send({
				embeds: [
					new EmbedBuilder()
						.setTitle(`${interaction.member.id}`)
						.setDescription(`**Podanie użytkownika: [${interaction.user.tag}](https://com/users/${interaction.member.id})**\n${podanie}`)
						.setFooter({ text: `Użył/a: ${interaction.user.tag} ▫️ ID: ${interaction.member.id}` })
						.setTimestamp()
						.setColor(interaction.member.displayHexColor),
				],
				components: [row],
			})
			.then(async (m) => {
				await m.react("👍");
				await m.react("👎");
			});
		let podanieData = await inneData.findOne({ name: "rekrutacja" });

		let rekrutant = await rekru.findOne({ userId: interaction.member.id });
		if (rekrutant) {
			rekrutant.podania.push({ date: podanieData.value.startedAt, text: podanie });
			rekrutant.save().catch((e) => console.log(e));
		} else await rekru.create({ userId: interaction.member.id, podania: [{ date: podanieData.value.startedAt, text: podanie }] });

		await interaction.deferReply({ ephemeral: true });
		client.success(interaction, { description: "Podanie zostało wysłane!" });
	},
};
