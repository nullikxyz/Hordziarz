const mundialModel = require("../../models/obstawianie");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const fs = require("fs");

module.exports = {
	name: "obstawianie",
	async execute(client, interaction) {
		const cId = interaction.customId.split("-")[1];
		let [obstawianie] = await Promise.all([mundialModel.findOne({ customId: cId }), interaction.deferReply()]);
		if (!obstawianie) return client.error(interaction, { description: "To obstawianie nie jest już aktywna." });

		const obsChannel = await client.channels.resolve(obstawianie.channelId);
		const obsMessage = await obsChannel?.messages.fetch(obstawianie.messageId).catch((err) => {});

		let buttonsEdit = [
			ButtonBuilder.from(obsMessage?.components[0].components[0])
				.setStyle(interaction.values[0] == "pierwsza" ? ButtonStyle.Success : ButtonStyle.Danger)
				.setDisabled(true),
			ButtonBuilder.from(obsMessage?.components[0].components[obstawianie.remis.active ? 2 : 1])
				.setStyle(interaction.values[0] == "druga" ? ButtonStyle.Success : ButtonStyle.Danger)
				.setDisabled(true),
		];

		obstawianie.remis.active
			? buttonsEdit.splice(
					1,
					0,
					ButtonBuilder.from(obsMessage?.components[0].components[1])
						.setStyle(interaction.values[0] == "remis" ? ButtonStyle.Success : ButtonStyle.Danger)
						.setDisabled(true)
			  )
			: "";

		obsMessage?.edit({ components: [new ActionRowBuilder().addComponents(buttonsEdit)] });
		await Promise.all([mundialModel.findByIdAndRemove(obstawianie._id)]);

		interaction.message.delete();
		await fs.writeFileSync("./Main/inne/mundialWin.txt", JSON.stringify(obstawianie[interaction.values[0]].votes, null, 4));
		client.success(interaction, { description: `Osoby, które obstawiły poprawnie: \`${obstawianie[interaction.values[0]].votes.length}\``, files: [{ attachment: "./Main/inne/mundialWin.txt", name: `mundial_wyniki_${new Date().toLocaleString().split(",")[0]}_${obstawianie["pierwsza"].name}-vs-${obstawianie["druga"].name}.txt` }] });
	},
};
