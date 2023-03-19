const colorString = require("../util/colorString");

class Logger {
	constructor() {
		this.events = 0;
		this.modals = 0;
		this.buttons = 0;
		this.contexts = 0;
		this.commands = 0;
	}

	clientReady(client) {
		const last_login = new Date();
		last_login.setHours(last_login.getUTCHours() + 2);

		const logs = [
			{
				key: "Logged in as",
				value: client.user.tag,
			},
			{
				key: "Last login",
				value: last_login.toLocaleString(),
			},
			{
				key: "Loaded events",
				value: this.events,
			},
			{
				key: "Loaded modals",
				value: this.modals,
			},
			{
				key: "Loaded buttons",
				value: this.buttons,
			},
			{
				key: "Loaded contexts",
				value: this.contexts,
			},
			{
				key: "Loaded commands",
				value: this.commands,
			},
		];

		const longestKey = logs.reduce((acc, cur) => {
			return acc.key.length > cur.key.length ? acc : cur;
		});

		console.log(logs.map((log) => `${colorString("[READY]", "magenta")} ${log.key.padEnd(longestKey.key.length)}: ${colorString(log.value, "magenta")}`).join("\n"));
	}

	error(error) {
		console.log(`${colorString("[ERROR]", "red")} ${error}`);
		console.log(error.stack);
	}

	warn(message) {
		console.log(`${colorString("[WARN] ", "yellow")} ${message}`);
	}

	info(message) {
		console.log(`${colorString("[INFO] ", "cyan")} ${message}`);
	}
}

module.exports = Logger;
