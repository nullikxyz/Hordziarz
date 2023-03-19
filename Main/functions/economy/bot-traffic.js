module.exports = async (client, message) => {
	if (message.author.id == client.id) return;
	const args = message.content.trim().split(/ +/);
	const member = message.mentions.members.first();
	let change = {
		cash: 0,
		bank: 0,
	};
	if (!member) return;
	if (!["cash", "bank"].includes(args[1])) return;
	if (!Number(args[2])) return;
	if (!args[3]) return;

	change[args[1]] = Number(args[2]);

	if (args[3] == "Bank" && Math.sign(Number(args[2])) == -1) {
		const balance = await client.unbelieva.getUserBalance(client.config.servers.hordaId, member.id);
		if (Math.sign(balance.cash + Number(args[2])) == -1) return message.react("❌");
	}
	try {
		client.unbelieva.editUserBalance(client.config.servers.hordaId, member.id, change, args.slice(3).join(" "));
		message.react("✅");
	} catch (err) {
		client.logger.error(err);
	}
};
