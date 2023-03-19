const mundialModel = require("../../models/obstawianie");
const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const { getCooldown, setCooldown } = require("../../functions/client/cooldown");
const humanizeDuration = require("../../functions/time/humanizeDuration");
const parseDuration = require("../../functions/time/parseDuration");

module.exports = {
	name: "obstawianki",
	async execute(client, interaction) {
		const cId = interaction.customId.split("-")[2];
		let [obstawianie] = await Promise.all([mundialModel.findOne({ customId: cId }), interaction.deferReply({ ephemeral: true })]);
		if (!obstawianie) return client.error(interaction, { description: "To obstawianie nie jest już aktywna." });

		const obsChannel = await client.channels.resolve(obstawianie.channelId);
		const obsMessage = await obsChannel?.messages.fetch(obstawianie.messageId).catch((err) => {});

		if (obstawianie.time && obstawianie.time <= Date.now()) {
			let buttonsEdit = obsMessage?.components[0].components.map((x) => ButtonBuilder.from(x).setDisabled(true));

			obsMessage?.edit({ components: [new ActionRowBuilder().addComponents(buttonsEdit)] });
			await Promise.all([mundialModel.findByIdAndUpdate(obstawianie._id, { enabled: false })]);
			return client.error(interaction, { description: "Głosowanie na te mecze jest wstrzymane." });
		}

		const action = interaction.customId.split("-")[1];

		const cd = await getCooldown(client, interaction.member.id, `mundial-${cId}`);
		if (cd) return client.error(interaction, { description: `Zmiana głosu możliwa za: \`${humanizeDuration(cd - Date.now())}\`` });

		switch (action) {
			case "pierwsza":
				if (obstawianie.pierwsza.votes.includes(interaction.member.id)) return client.error(interaction, { description: "Oddałeś/aś już głos na tą reprezentację!" });
				[obstawianie] = await Promise.all([mundialModel.findByIdAndUpdate(obstawianie._id, { $pull: { "druga.votes": interaction.member.id, "remis.votes": interaction.member.id }, $push: { "pierwsza.votes": interaction.member.id } }, { returnOriginal: false })]);

				client.success(interaction, { description: "Poprawnie oddano głos na pierwszą reprezentację." });
				break;

			case "druga":
				if (obstawianie.druga.votes.includes(interaction.member.id)) return client.error(interaction, { description: "Oddałeś/aś już głos na tą reprezentację!" });
				[obstawianie] = await Promise.all([mundialModel.findByIdAndUpdate(obstawianie._id, { $pull: { "pierwsza.votes": interaction.member.id, "remis.votes": interaction.member.id }, $push: { "druga.votes": interaction.member.id } }, { returnOriginal: false })]);

				client.success(interaction, { description: "Poprawnie oddano głos na drugą reprezentację." });
				break;
			case "remis":
				if (obstawianie.remis.votes.includes(interaction.member.id)) return client.error(interaction, { description: "Oddałeś/aś już głos na tą reprezentację!" });
				[obstawianie] = await Promise.all([mundialModel.findByIdAndUpdate(obstawianie._id, { $pull: { "druga.votes": interaction.member.id, "pierwsza.votes": interaction.member.id }, $push: { "remis.votes": interaction.member.id } }, { returnOriginal: false })]);

				client.success(interaction, { description: "Poprawnie oddano głos na remis reprezentacji." });
				break;
			default:
				break;
		}

		await setCooldown(client, interaction.member.id, `mundial-${cId}`, parseDuration("5m") + Date.now());
		let fields = [
			{ name: "Reprezentacja pierwsza", value: `Ilość głosów: \`${obstawianie.pierwsza.votes.length}\``, inline: true },
			{ name: "Reprezentacja druga", value: `Ilość głosów: \`${obstawianie.druga.votes.length}\``, inline: true },
		];
		obstawianie.remis.active ? fields.splice(1, 0, { name: "Remis", value: `Ilość głosów: \`${obstawianie.remis.votes.length}\``, inline: true }) : "";

		return obsMessage.edit({ embeds: [EmbedBuilder.from(obsMessage.embeds[0]).setFields(fields)] });
	},
};
