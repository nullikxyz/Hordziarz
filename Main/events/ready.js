const { cooldown, statystyki, urlopy, kanaly_prywatne, teczowy, zagadki } = require("../functions/client/schedules");
const toCache = require("../functions/util/toCache");
const losy = require("../functions/economy/losy");
const { ActivityType } = require("discord.js");

module.exports = async (client) => {
	client.guilds.cache.forEach((g) => {
		g?.commands.set(client.commands.map((i) => i.data.toJSON()).filter((x) => x.name != "ping"));
	});
	client.application.commands.set([client.commands.get("ping").data.toJSON()]);
	toCache(client);

	client.user.setPresence({
		status: "idle",
		activities: [
			{
				name: "",
				type: ActivityType.Listening,
			},
		],
	});
	client.logger.clientReady(client);

	zagadki(client);

	setInterval((_) => {
		if (client.losyArray.length) {
			let los = client.losyArray.shift();
			return losy(client, los.message, los.los);
		}
	}, 500);

	setInterval((_) => {
		cooldown(client);
		urlopy(client);
	}, 5 * 1000);

	setInterval((_) => {
		statystyki(client);
	}, 60 * 1000);

	setInterval((_) => {
		teczowy(client);
		kanaly_prywatne(client);
	}, 3 * 60 * 60 * 1000);
};
