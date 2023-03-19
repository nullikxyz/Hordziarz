const mongoose = require("mongoose");
const inne = require("../../models/inne");
const rekrutacja = require("../../models/rekrutacja");
const moment = require("moment");
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder } = require("discord.js");

module.exports = {
	name: "rekru",
	async execute(client, interaction) {
		try {
			let rowArch = new ActionRowBuilder().addComponents([new ButtonBuilder().setEmoji("<:icons_archive:869507189797158953>").setStyle("Danger").setCustomId("rekru-arch")]);
			let rekrutant = interaction.message.embeds[0].title;
			let akcja = interaction.customId.split("-")[1];
			let inneData = await inne.findOne({ name: "rekrutacja" });

			if (akcja == "zgloszenie") {
				let data = await rekrutacja.findOne({ userId: interaction.member.id });

				if (!inneData.value.open) {
					await interaction.deferReply({ ephemeral: true });
					return client.error(interaction, { description: "Rekrutacja jest wyłączona" });
				}
				if (data) {
					if (data.podania.find((x) => x.date == inneData.value.startedAt)) {
						await interaction.deferReply({ ephemeral: true });
						return client.error(interaction, { description: "Wysłano maksymalną ilość podań na aktualną rekrutację." });
					}
				}
				let wzor = "• Imię: \n• Wiek: \n• Od kiedy udzielasz się na serwerze? \n• Ile czasu dziennie możesz poświęcić na moderowanie i w których godzinach? \n• Jakie jest twoje doświadczenie w moderowaniu? \n• Dlaczego chciałbyś zostać moderatorem? \n• Coś o sobie: \n• Znajomość ortografii i interpunkcji (1-10): \n• Czy posiadasz sprawny mikrofon:";

				const modal = new ModalBuilder()
					.setCustomId("rekrutacja")
					.setTitle("Rekrutacja do ekipy")
					.addComponents([new ActionRowBuilder().addComponents([new TextInputBuilder().setCustomId("podanie").setLabel("Podanie").setStyle(TextInputStyle.Paragraph).setMaxLength(2048).setValue(wzor).setRequired(true)])]);

				await interaction.showModal(modal);
			} else {
				await interaction.deferReply({ ephemeral: true });

				if (akcja == "arch") {
					interaction.guild.channels.cache
						.get("943472781050396692")
						.threads.cache.get("978030302238765096")
						.send({ embeds: [interaction.message.embeds[0]] });
					client.success(interaction, { description: "Przeniesiono do archiwum" });
					return interaction.message.delete();
				}

				if (!inneData.value.accept) return client.error(interaction, { description: "Akceptowanie oraz odrzucanie wiadomości jest aktualnie wyłączone." });

				let thread = interaction.channel.threads.cache.get(inneData.value.threadId[akcja]);
				if (!thread)
					thread = await interaction.channel.threads.create({
						name: `Rekrutacja ${moment(inneData.value.startedAt).format("DD-MM-YYYY")} ${akcja}`,
						autoArchiveDuration: 10080,
						reason: "Rekrutacja",
					});

				inneData.value.threadId[akcja] = thread.id;
				await inne.findByIdAndUpdate(inneData._id, inneData);
				thread.send({ embeds: [interaction.message.embeds[0]], components: akcja != "odrzucone" ? [rowArch] : [] });

				client.success(interaction, { description: `Podanie użytkownika <@${rekrutant}> zostało przeniesione na ${thread}` });

				interaction.message.delete();
			}
		} catch (e) {
			console.log(e);
		}
	}
};
