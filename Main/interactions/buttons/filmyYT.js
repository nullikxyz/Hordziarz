const { sendVid } = require("../../functions/util/filmyYT");

module.exports = {
	name: "filmy_yt",
	async execute(client, interaction) {
		const type = interaction.customId.split("-")[1];
		const url = interaction.message.content.split(" ")[1];

		await interaction.message.delete();
		return sendVid(client, `${type == "film" ? "@everyone" : `<@&${client.config.filmy_yt.shortsRole}>`} Na kanale **${interaction.message.embeds[0].author.name}** pojawił się nowy ${type == "film" ? "film!" : "shorts!"}\n${url}`);
	},
};
