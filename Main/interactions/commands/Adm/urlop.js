const { addUrlop, removeUrlop, listUrlops } = require("../../../functions/client/urlopy");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const parseDuration = require("../../../functions/time/parseDuration");
const humanizeDuration = require("../../../functions/time/humanizeDuration");

const urlopy = require("../../../models/urlopy");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("urlop")
		.setDescription("Nadaje, zabiera lub wyświetla listę urlopów")
		.addSubcommand((s) =>
			s
				.setName("nadaj")
				.setDescription("Nadaje urlop")
				.addUserOption((user) => user.setName("osoba").setDescription("Osoba, której chcesz nadać urlop").setRequired(true))
				.addStringOption((string) => string.setName("czas").setDescription("Czas na jaki chcesz nadać urlop").setRequired(true))
				.addStringOption((string) => string.setName("powód").setDescription("Powód urlopu"))
		)
		.addSubcommand((s) =>
			s
				.setName("zabierz")
				.setDescription("Zabiera urlop")
				.addUserOption((user) => user.setName("osoba").setDescription("Osoba, której chcesz zabrać urlop").setRequired(true))
		)
		.addSubcommand((s) => s.setName("lista").setDescription("Wyświetla listę osób na urlopach")),
	async execute(client, interaction) {
		try {
			const action = interaction.options.getSubcommand();

			if (action == "lista") return listUrlops(client, interaction);
			const member = interaction.options.getMember("osoba");

			if (action == "nadaj") {
				const duration = parseDuration(interaction.options.getString("czas"));
				const reason = interaction.options.getString("powód") || "Nie podano!";

				if (!duration) return client.error(interaction, { description: "Podano błędny czas" });

				const data = await urlopy.findOne({ userId: member.id });

				if (data) return client.error(interaction, { description: "Podana osoba jest już na urlopie." });
				if (interaction.member.id == member.id) return client.error(interaction, { description: "Nie możesz nadać urlopu samemu sobie." });
				if (interaction.member.roles.highest.position < member.roles.highest.position) return client.error(interaction, { description: "Nie możesz nadać urlopu osobie, która jest wyżej niż Ty!" });

				let reply = await interaction.editReply({
					embeds: [
						new EmbedBuilder()
							.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
							.setColor(client.config.embedHex)
							.setDescription("Wybierz rodzaj urlopu.")
							.addFields([
								{ name: "Ekipowicz:", value: `<@${member.user.id}> \`[${member.user.tag}]\``, inline: true },
								{ name: "Długość:", value: humanizeDuration(duration), inline: true },
								{ name: "Powód:", value: reason, inline: true },
							]),
					],
					components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setLabel("Zwykły").setCustomId("nrm").setStyle("Primary"), new ButtonBuilder().setLabel("Mniejsza aktywność").setCustomId("low").setStyle("Primary"), new ButtonBuilder().setLabel("Anuluj").setCustomId("clc").setStyle("Danger")])],
				});

				const filter = (i) => i.member.id == interaction.member.id;
				let collected = await reply
					.awaitMessageComponent({ filter, max: 1, time: 30 * 1000, errors: ["time"] })
					.then((c) => {
						return c.customId;
					})
					.catch((c) => {
						if (!c.size) return "clc";
					});

				if (collected == "clc") return client.error(interaction, { description: "Wstrzymano!" });
				if (collected == "nrm") {
					if (interaction.guild.members.me.roles.highest.position > member.roles.highest.position) member.roles.remove(member.roles.highest);
					member.roles.remove(client.config.roles.inne.kruczek);
				}

				const type = collected;
				member.roles.add(client.config.roles.inne.urlop);

				let succesFields = [];
				if (type == "nrm") succesFields.push({ name: "Ranga:", value: `<@&${member.roles.highest.id}>`, inline: true });
				succesFields.push({ name: "Typ:", value: type == "low" ? "Mniejsza aktywność" : "Zwykły", inline: true }, { name: "Nadano przez:", value: `<@${interaction.member.id}> \`[${interaction.user.tag}]\``, inline: true });

				client.success(interaction, { description: "Urlop został nadany!", fields: succesFields });

				addUrlop(client, member, interaction.user, duration, reason, type);
			}

			if (action == "zabierz") {
				let urlopowicz = await urlopy.findOne({ userId: member.id });
				if (!urlopowicz) return client.error(interaction, { description: "Podana osoba nie jest na urlopie!" });

				removeUrlop(client, member, interaction.user);
				client.success(interaction, { description: `Pomyślnie zabrano urlop ${member} \`[${member.user.tag}]\`!` });
			}
		} catch (err) {
			console.log(err);
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
