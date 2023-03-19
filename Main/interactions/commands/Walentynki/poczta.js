const { SlashCommandBuilder } = require("@discordjs/builders");
const { getCooldown, setCooldown } = require("../../../functions/client/cooldown");
const humanizeDuration = require("../../../functions/time/humanizeDuration");
const randomString = require("randomstring");
const walentynki = require("../../../models/walentynki");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("poczta")
		.setDescription("Poczta")
		.addSubcommand((sc) =>
			sc
				.setName("walentynkowa")
				.setDescription("Wyślij walentynkę do wybranej osoby")
				.addUserOption((user) => user.setName("osoba").setDescription("Osoba, której chcesz wysłać walentynkę.").setRequired(true))
				.addStringOption((string) => string.setName("treść").setDescription("Treść walentynki").setMaxLength(1000).setRequired(true))
		),
	hidden: true,
	async execute(client, interaction) {
		try {
			let target = interaction.options.getMember("osoba");
			let sender = interaction.member;
			let text = interaction.options.getString("treść");
			let blacklista = ["236585666731966466"];

			if (target.id == sender.id) return client.error(interaction, { description: "Nie możesz wysyłać wiadomości samemu sobie." });
			if (blacklista.includes(target.id)) return client.error(interaction, { description: "Tej osobie nie można wysyłać poczty walentynkowej." });

			let cd = await getCooldown(client, sender.id, "poczta-walentynkowa");
			if (cd && !client.config.developers.includes(interaction.member.id)) return client.error(interaction, { description: `Nastepną wiadomość walentynkową możesz wysłać za: \`${humanizeDuration(cd - Date.now())}\`` });

			let code = randomString.generate(8);

			target
				.send({
					embeds: [
						new EmbedBuilder()
							.setTitle("💘 Poczta walentynkowa 💘")
							.setColor("Purple")
							.setDescription(text)
							.setFooter({ text: `Custom ID walentynki: #${code}` }),
					],
					components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("pw").setLabel("💘HORDA KONOPA💘").setDisabled(true).setStyle("Success")])],
				})
				.then(async (x) => {
					client.success(interaction, { description: `Poprawnie wysłano walentynkę do ${target}😍!` });

					await walentynki.create({
						from: sender.id,
						to: target.id,
						code: code,
						text: text,
					});

					await setCooldown(client, sender.id, "poczta-walentynkowa", Date.now() + 10 * 60 * 1000);
				})
				.catch((e) => {
					return client.error(interaction, { description: "Ta osoba ma wyłączone wiadomości prywatne." });
				});
		} catch (err) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
