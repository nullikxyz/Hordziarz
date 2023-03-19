const { readdirSync } = require("node:fs");
const { join } = require("path");

const handlers = {
	events: {
		path: join(process.cwd(), "Main", "events"),
		subfolders: false
	},
	commands: {
		path: join(process.cwd(), "Main", "interactions", "commands"),
		subfolders: true
	},
	buttons: {
		path: join(process.cwd(), "Main", "interactions", "buttons"),
		subfolders: false
	},
	modals: {
		path: join(process.cwd(), "Main", "interactions", "modals"),
		subfolders: false
	}
}

module.exports = async client => {
	for (const [type, { path, subfolders }] of Object.entries(handlers)) {
		const files = readdirSync(path);

		for (const file of files) {
			let handlerName = file

			if (subfolders) {
				const subfolders = readdirSync(join(path, handlerName));

				for (const subfolder of subfolders) {
					const subfolderHandler = require(join(path, handlerName, subfolder));
					subfolderHandler.category = handlerName;

					client[type].set(subfolderHandler.data.toJSON().name, subfolderHandler);
					client.logger[type]++;
				}
			} else {
				const handler = require(join(path, file));
				handlerName = file.replace('.js', '');

				if (type != "events") client[type].set(handler.name, handler);
				else client.on(handlerName, async (...args) => await handler(client, ...args));

				client.logger[type]++;
			}
		}
	}
};
