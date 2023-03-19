const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder().setName("pomoc").setDescription("Komenda pomocy"),
	async execute(client, interaction) {
		try {
			let adm = Object.values(client.config.roles.adm);
			let mod = Object.values(client.config.roles.mod);

			let cmdList = {};
			for (cmd of client.commands)
				if (!cmdList[cmd[1].category]) cmdList[cmd[1].category] = [{ name: cmd[1].data.toJSON().name, desc: cmd[1].data.toJSON().description }];
				else cmdList[cmd[1].category].push({ name: cmd[1].data.toJSON().name, desc: cmd[1].data.toJSON().description });

			if (!client.config.developers.includes(interaction.member.id)) delete cmdList["Dev"];
			if (!interaction.member.roles.cache.some((r) => adm.includes(r.id))) delete cmdList["Adm"];
			if (!interaction.member.roles.cache.some((r) => mod.includes(r.id)) && !interaction.member.roles.cache.some((r) => adm.includes(r.id))) delete cmdList["Mod"];

			let display = "";
			for (cat in cmdList) {
				display += `\n**__${cat}__**\n`;
				for (cmd of cmdList[cat]) display += `• \`/${cmd.name}\` - *${cmd.desc}*\n`;
			}

			return client.success(interaction, { description: display });
		} catch (err) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
