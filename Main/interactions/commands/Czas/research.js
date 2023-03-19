const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName("research")
		.setDescription("Komenda do zarządzania researcherami.")
		.addIntegerOption((integer) => integer.setName("akcja").setDescription("Co chcesz zrobić z daną rolą").addChoices({ name: "nadaj", value: 1 }, { name: "zabierz", value: 0 }).setRequired(true))
		.addUserOption((user) => user.setName("osoba").setDescription("Osoba, której chcesz nadać/zabrać rolę").setRequired(true)),
	requiredRoles: ["1077675739593318400"],
	async execute(client, interaction) {
		try {
			let akcja = interaction.options.getInteger("akcja");
			let osoba = interaction.options.getMember("osoba");

			if(!osoba) return client.error(interaction, { description: "Tej osoby nie ma już na serwerze."})

			if (akcja) {
				if (osoba.roles.cache.has("951229493589205152")) return client.error(interaction, { description: "Ta osoba ma już tą rolę!" });
				osoba.roles.add("951229493589205152");
				client.success(interaction, { description: `${osoba} otrzymał/a rangę <@&951229493589205152>` });
			} else {
				if (!osoba.roles.cache.has("951229493589205152")) return client.error(interaction, { description: "Ta osoba nie ma tej rangi!" });
				osoba.roles.remove("951229493589205152");
				client.error(interaction, { description: `${osoba} stracił/a rangę <@&951229493589205152>` });
			}

			let logChannel = interaction.guild.channels.cache.get("943472781050396692").threads.cache.get("1077680571989364756");
			if (!logChannel) return;
			else
				logChannel.send({
					embeds: [
						new EmbedBuilder()
							.setAuthor({
								name: interaction.user.tag,
								iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
							})
							.setDescription(`${akcja ? "Nadano" : "Zabrano"} rangę <@&951229493589205152> \`[Resercher na czasie]\` użytkownikowi ${osoba} \`[${osoba.user?.tag}]\``)
							.setColor(akcja ? "Green" : "Red")
							.setTimestamp(),
					],
				});
		} catch (err) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
