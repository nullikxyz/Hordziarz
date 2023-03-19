const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, SelectMenuBuilder } = require("discord.js");

let embedsList = ["regulamin", "eventy-burdel", "weryfikacja", "reporterzy", "rekrutacja", "popros-o-role", "pomysly", "kanaly-prywatne"];

module.exports = {
	data: new SlashCommandBuilder()
		.setName("embedy")
		.setDescription("Komenda do tworzenia stałych embedów")
		.addChannelOption((channel) => channel.setName("kanał").setDescription("Kanał, na który ma zostac wysłany embed.").addChannelTypes(0)),
	async execute(client, interaction) {
		try {
			let channel = interaction.options.getChannel("kanał")?.id || "";
			client.success(interaction, { description: "Jaki embed chcesz wysłać?", components: [new ActionRowBuilder().addComponents([new SelectMenuBuilder().setCustomId(`embedy-${interaction.member.id}-${channel}`).setOptions(embedsList.map((x) => ({ label: `Embed ${x.replace(/-/g, " ")}`, description: `Wysyła embed ${x.replace(/-/g, " ")}.`, value: x })))])] });
		} catch (err) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
