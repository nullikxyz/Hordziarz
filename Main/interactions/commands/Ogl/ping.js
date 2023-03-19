const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const humanizeDuration = require("../../../functions/time/humanizeDuration");

module.exports = {
	data: new SlashCommandBuilder().setName("ping").setDescription("Komenda do sprawdzania pingu bota"),
	async execute(client, interaction) {
		try {
			interaction.editReply({ embeds: [new EmbedBuilder().setDescription("Obliczanie...")] }).then((rep) => client.success(interaction, { description: `🏓 Pong!\nBot ping: \`${Date.now() - rep.createdTimestamp}ms\`\nWs ping: \`${client.ws.ping}ms\`\nBot uptime: \`${humanizeDuration(client.uptime)}\`` }));
		} catch (err) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
