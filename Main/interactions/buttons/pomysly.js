const { ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
	name: "pomysly",
	async execute(client, interaction) {
		try {
			if (interaction.member.roles.cache.has(client.config.roles.inne.pomBlok)) {
				await interaction.deferReply({ ephemeral: true });
				return client.error(interaction, { description: `Posiadając <@&${client.config.roles.inne.pomBlok}> nie możesz tworzyć, edytować oraz usuwać pomysłów!` });
			}
			let akcja = interaction.customId.split("-")[1];

			switch (akcja) {
				case "dodaj":
				case "edytuj":
					const modalUser = new ModalBuilder().setCustomId(interaction.customId).setTitle("Propozycje serwerowe");

					const idLabel = new TextInputBuilder().setCustomId("id").setLabel("ID").setStyle(TextInputStyle.Short).setMinLength(19).setMaxLength(19).setPlaceholder("ID wiadomości z propozycją.").setRequired(true);
					const tematLabel = new TextInputBuilder().setCustomId("temat").setLabel("Temat").setStyle(TextInputStyle.Short).setMinLength(8).setMaxLength(32).setPlaceholder("Temat propozycji.").setRequired(true);
					const trescLabel = new TextInputBuilder().setCustomId("tresc").setLabel("Treść").setStyle(TextInputStyle.Paragraph).setMinLength(16).setMaxLength(2048).setPlaceholder("Treść propozycji.").setRequired(true);

					const row1 = new ActionRowBuilder().addComponents([idLabel]);
					const row2 = new ActionRowBuilder().addComponents([tematLabel]);
					const row3 = new ActionRowBuilder().addComponents([trescLabel]);

					let arrOfComp = [row3];
					akcja != "dodaj" ? arrOfComp.unshift(row1) : arrOfComp.unshift(row2);

					modalUser.addComponents(arrOfComp);
					return await interaction.showModal(modalUser);
				case "opcje":
					if (!interaction.member.roles.cache.some((x) => Object.values(client.config.roles.adm).includes(x.id))) {
						await interaction.deferReply({ ephemeral: true });
						return client.error(interaction, { description: "Tylko administracja może akceptować bądź odrzucać pomysły." });
					}
					await interaction.deferUpdate()
					return interaction.message
						.edit({
							components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId(`pomysly-akceptacji-${interaction.member.id}`).setStyle("Success").setEmoji("<:yes:942751104662396948>"), new ButtonBuilder().setCustomId(`pomysly-odrzucenia-${interaction.member.id}`).setStyle("Danger").setEmoji("<:no:942751104708538419>")])],
						})
						.then(() => setTimeout((_) => interaction.message.edit({ components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("pomysly-opcje").setStyle("Primary").setEmoji("<:shield:836882196995375114>")])] }), 5000));
				default:
					if (!interaction.member.roles.cache.some((x) => Object.values(client.config.roles.adm).includes(x.id))) return client.error(interaction, { description: "Tylko administracja może akceptować bądź odrzucać pomysły." });
					if (interaction.customId.split("-")[2] != interaction.member.id) return client.error(interaction, { description: "Inna osoba z administracji zarządza tym pomysłem!" });
					const modalAdm = new ModalBuilder().setCustomId(interaction.customId).setTitle("Zarządzanie propozycją serwerową");

					const powodLabel = new TextInputBuilder().setCustomId("tresc").setLabel("Powód").setStyle(TextInputStyle.Paragraph).setMaxLength(512).setPlaceholder(`Podaj powód ${akcja} propozycji lub wpisz "brak", jeżeli nie chcesz podawać!`);

					modalAdm.addComponents([new ActionRowBuilder().addComponents([powodLabel])]);
					return await interaction.showModal(modalAdm);
			}
		} catch (err) {
			if(err == "Unknown Message" || err.code == 10008) return;
			console.log(err);
		}
	}
};
