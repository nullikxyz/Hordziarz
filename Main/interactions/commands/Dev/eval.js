const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("eval")
		.setDescription("Wykonuje podany kod")
		.addStringOption((string) => string.setName("kod").setDescription("Kod do wykonania").setRequired(true))
		.addBooleanOption((boolean) => boolean.setName("async").setDescription("Funkcja async?")),
	async execute(client, interaction) {
		let code = interaction.options.getString("kod");
		const asyncCheck = interaction.options.getBoolean("async");
		try {
			asyncCheck ? (code = `(async()=>{${code}})()`) : "";
			if (["client.token", "TOKEN", "process.env"].includes(code)) return client.error(interaction, { description: "nt." });

			let evaled = eval(code);
			let type = typeof evaled;
			if (typeof evaled !== "string") evaled = require("util").inspect(evaled, { depth: 0 });
			let output = clean(evaled);

			if (output.length > 4069) {
				client.error(interaction, { description: "Output jest za długi, aby go wyświetlić!\nSprawdź konsolę!" });
				console.log(output);
			} else
				return client.success(interaction, {
					description: `**Output**\n\`\`\`js\n${output}\`\`\``,
					author: { name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) },
					title: "Eval",
					color: interaction.member.displayHexColor,
					fields: [{ name: "Typ", value: `\`${type}\`` }],
				});
		} catch (error) {
			let err = clean(error);

			if (err.length > 4069) {
				client.error(interaction, { description: "Error jest za długi, aby go wyświetlić!\nSprawdź konsolę!" });
				console.log(error);
			} else
				return client.error(interaction, {
					description: `**Error**\n\`\`\`js\n${err}\`\`\``,
					title: "Eval",
					author: { name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) },
				});
		}
	},
};

function clean(string) {
	if (!typeof string == "string") return string;
	else
		return string
			.toString()
			.replace(/`/g, "`" + String.fromCharCode(8203))
			.replace(/@/g, "@" + String.fromCharCode(8203));
}
