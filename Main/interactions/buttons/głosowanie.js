const glosowaniaModel = require("../../models/głosowanie");

module.exports = {
	name: "glosowanie",
	async execute(client, interaction) {
		let [glosowanie] = await Promise.all([glosowaniaModel.findOne({}), interaction.deferReply({ ephemeral: true })]);

		try {
			let target = interaction.customId.split("-")[1];
			let ocena = interaction.customId.split("-")[2];

			if (!glosowanie) return client.error(interaction, { description: "W obecnej chwili nie odbywa się żadne głosowanie." });
			if (glosowanie.userID != target) return client.error(interaction, { description: "Głosowaine na tą osobe już się zakończyło." });
			if (glosowanie.userID == interaction.member.id) return client.error(interaction, { description: "Nie możesz oddawać głosu na samego siebie." });
			if (glosowanie.votes[interaction.member.id]) return client.error(interaction, { description: `Oddałeś/aś już swój głos na <@${target}>` });

			glosowanie.votes[interaction.member.id] = +ocena;
			await glosowaniaModel.findOneAndUpdate({}, { votes: glosowanie.votes });

			return client.success(interaction, { description: `Oceniono występ <@${target}> na ${ocena} pkt.` });
		} catch (error) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(error);
		}
	},
};
