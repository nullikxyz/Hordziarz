const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

let roles = {
	"Artysta": "517088607660539949",
	"Artysta Miesiąca": "767475033639092275",
	"Shitposter": "668041019908030474",
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName("grafikomania")
		.setDescription("Komenda do zarządzania rolami graficznymi.")
		.addIntegerOption((integer) => integer.setName("akcja").setDescription("Co chcesz zrobić z daną rolą").addChoices({ name: "nadaj", value: 1 }, { name: "zabierz", value: 0 }).setRequired(true))
		.addStringOption((string) =>
			string
				.setName("rola")
				.setDescription("Rola, którą chcesz zadać/zabrać")
				.addChoices(...Object.keys(roles).map((x) => ({ name: x, value: roles[x] })))
				.setRequired(true)
		)
		.addUserOption((user) => user.setName("osoba").setDescription("Osoba, której chcesz nadać/zabrać rolę").setRequired(true)),
	requiredRoles: ["648129948086829056"],
	async execute(client, interaction) {
		try {
			let akcja = interaction.options.getInteger("akcja");
			let rola = interaction.options.getString("rola");
			let osoba = interaction.options.getMember("osoba");

			if(!osoba) return client.error(interaction, { description: "Tej osoby nie ma już na serwerze."})

			if (akcja) {
				if (osoba.roles.cache.has(rola)) return client.error(interaction, { description: "Ta osoba ma już tą rolę!" });
				osoba.roles.add(rola);
				client.success(interaction, { description: `${osoba} otrzymał/a rangę <@&${rola}>` });
			} else {
				if (!osoba.roles.cache.has(rola)) return client.error(interaction, { description: "Ta osoba nie ma tej rangi!" });
				osoba.roles.remove(rola);
				client.error(interaction, { description: `${osoba} stracił/a rangę <@&${rola}>` });
			}

			let logChannel = interaction.guild.channels.cache.get("943472781050396692").threads.cache.get("988765264759889920");
			if (!logChannel) return;
			else
				logChannel.send({
					embeds: [
						new EmbedBuilder()
							.setAuthor({
								name: interaction.user.tag,
								iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
							})
							.setDescription(`${akcja ? "Nadano" : "Zabrano"} rangę <@&${rola}> \`[${Object.keys(roles).find((x) => roles[x] == rola)}]\` użytkownikowi ${osoba} \`[${osoba.user?.tag}]\``)
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
