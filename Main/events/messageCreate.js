const bot_traffic = require("../functions/economy/bot-traffic");
const { zagadkiEnd } = require("../functions/economy/zagadki");
const { newVid } = require("../functions/util/filmyYT");
const { ban } = require('../functions/client/moderation');
const { check } = require('../functions/client/automod');

module.exports = async (client, message) => {
	if (!message.guild) return;
	if (message.channel.type == 5) return message.crosspost().catch((e) => console.log(e));
	if (message.channel.id == client.config.channels.bot_traffic) return bot_traffic(client, message);

	if (message.channel.id == client.config.filmy_yt.receivedChannel && message.embeds) return newVid(client, message)

	if (message.author.bot) return;

	if (client.zagadki.get(message.channel.id)) {
		let zagadka = client.zagadki.get(message.channel.id);
		if (zagadka.end <= Date.now()) return zagadkiEnd(client, zagadka.value, message.channel, null);
		if (zagadka.value.correct.trim().toLowerCase() === message.content.trim().toLowerCase() || zagadka.value.aliases.some((x) => x.trim().toLowerCase() == message.content.trim().toLowerCase())) return zagadkiEnd(client, zagadka.value, message.channel, message.member);
	}

	let losData = client.losy.get(message.content?.split(/ +/g)[0]);
	if (losData?.channels.includes(message.channel.id)) client.losyArray.push({ message: message, los: losData });
};
