const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

async function newVid(client, message) {
	if (message.content.includes("livestream")) return sendVid(client, `@everyone **${message.content.split(" ")[0]}** odpalił streama!\n${message.content.match(/https.+/gi)[0]}`, true);

	const [zgloszeniaChannel] = await Promise.all([client.channels.resolve(client.config.channels.zgloszenia)]);
	if (message.content.includes("video"))
		return zgloszeniaChannel?.send({
			content: `<@&${client.config.roles.inne.kruczek}> ${message.content.match(/https.+/gi)[0]}`,
			components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("filmy_yt-film").setStyle("Danger").setLabel("Film"), new ButtonBuilder().setCustomId("filmy_yt-shorts").setStyle("Success").setLabel("Short")])],
			allowedMentions: {
				roles: [client.config.roles.inne.kruczek],
			},
		});
}

async function sendVid(client, content, live = false) {
	const [filmy_youtube, liveChannel] = await Promise.all([client.channels.resolve(client.config.filmy_yt.postChannel), client.channels.resolve(client.config.filmy_yt.postLive)]);
	if (live)
		return liveChannel?.send({
			content: `${content}`,
			allowedMentions: {
				parse: ["everyone"],
			},
		});
	else
		return filmy_youtube?.send({
			content: `${content}`,
			allowedMentions: {
				roles: [client.config.filmy_yt.shortsRole],
				parse: ["everyone"],
			},
		});
}

module.exports = {
	newVid,
	sendVid,
};
