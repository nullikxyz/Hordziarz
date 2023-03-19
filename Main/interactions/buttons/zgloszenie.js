const zgloszenia = require("../../models/zgloszenia");
const { EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
	name: "zgloszenie",
	async execute(client, interaction) {
		let reportId = interaction.customId.split("-")[1];
		if (interaction.customId.split("-")[2] != "akceptuj") {
			const modal = new ModalBuilder()
				.setCustomId(`zgloszenie-${reportId}`)
				.setTitle("Odrzuć Zgłoszenie")
				.addComponents([new ActionRowBuilder().addComponents([new TextInputBuilder().setCustomId("reason").setLabel("Powód Odrzucenia").setStyle(TextInputStyle.Paragraph).setMaxLength(2048).setRequired(true)])]);
			return await interaction.showModal(modal);
		}

		await interaction.deferReply({ ephemeral: true });
		let report = await zgloszenia.findOne({ id: reportId });
		report.closed = true;
		report.comment = null;
		await report.save();

		switch (report.type) {
			case "PROSBA":
				client.success(interaction, { description: `Pomyślnie zaakceptowano prośbę użytkownika <@${report.userId}> o rolę <@&${report.roleId}>` }, [], true);
				client.channels.cache.get(client.config.channels.tablica).send({ content: `<@${report.userId}> | Twoja prośba o rolę została zaakceptowana!`, embeds: [new EmbedBuilder().setTitle(`Prośba #${reportId}`).setDescription(`**Prośba o:**\n<@&${report.roleId}>`).setColor(client.config.embedHex)], allowedMentions: { users: [report.userId] } });
				await interaction.channel.messages
					.resolve(interaction.message.id)
					.delete()
					.catch((e) => {});

				client.channels.cache
					.get(client.config.channels.logiMain)
					.threads.cache.get(client.config.channels.tablicaLogi)
					?.send({ embeds: [new EmbedBuilder().setColor("Green").setTimestamp().setTitle("Przyjęcie zgłoszenia").setDescription(`${interaction.member} Przyjął/ęła prośbe \`#${reportId}\` o rangę <@&${report.roleId}> złożoną przez <@${report.userId}>`)] });
				await interaction.guild.members.fetch(report.userId).then((m) => m?.roles.add(report.roleId));
				break;
		}
		return;
	},
};
