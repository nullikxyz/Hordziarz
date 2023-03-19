const moderation = require("../models/moderation");

module.exports = async (client, member) => {
	await member.roles.add(client.config.roles.inne.uzytkownik);
};
