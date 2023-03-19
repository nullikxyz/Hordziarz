const rangiModel = require("../../models/rangi_prywatne");
const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "rangaOdrzuc",
	async execute(client, interaction) {
		try {
			await interaction.deferReply({ ephemeral: true });
			let embed = new EmbedBuilder()
				.setTitle("Ranga prywatna")
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
				.setColor(client.config.embedHex);
			let member;
			try {
				member = await interaction.guild.members.fetch(interaction.customId.split("-")[1]);
			} catch (error) {}
			if (!member) {
				interaction.channel.messages
					.resolve(interaction.message.id)
					?.delete()
					.catch((e) => {});
				return client.error(interaction, { description: "Osoby nie ma już na serwerze!" });
			}
			const reason = interaction.fields.getTextInputValue("reason");
			let dataRanga = await rangiModel.findOne({ ownerId: interaction.customId.split("-")[1] });

			let zmiana = dataRanga?.akcja.split("-")[0] ?? "utworz";

			if (zmiana == "utworz") member.roles.add(client.config.prywatneRangi.nowa);
			else if (zmiana == "ikona" && !dataRanga.icon) member.roles.add(client.config.prywatneRangi.upgrade);
			else if (!dataRanga.color) member.roles.add(client.config.prywatneRangi.upgrade);

			console.log(dataRanga.akcja);
			console.log(dataRanga?.akcja.split("-")[1]);

			if (zmiana != "utworz") embed.setThumbnail(zmiana === "ikona" ? dataRanga?.akcja.split("-")[1] : `https://dummyimage.com/400x400/${dataRanga?.akcja.split("-")[1]}/${dataRanga?.akcja.split("-")[1]}`);
			dataRanga ? (dataRanga.akcja = null) : "";
			await dataRanga?.save().catch((e) => console.log(e));

			interaction.channel.messages
				.resolve(interaction.message.id)
				?.delete()
				.catch((e) => {});

			client.success(interaction, { description: "Odrzucono" });
			client.channels.cache
				.get(client.config.channels.logiMain)
				.threads.cache.get(client.config.prywatneRangi.thread)
				?.send({ embeds: [EmbedBuilder.from(embed).setDescription(`${interaction.member} odrzucił/a ${zmiana == "utworz" ? "utworzenie nowej" : zmiana == "kolor" ? "zmianę koloru" : "zmianę ikony"} rangi prywatnej${zmiana != "utworz" ? ` <@&${dataRanga.roleId}>` : `.\nOsoba składająca prośbę: <@${member.id}>`}.\nPowód: \`${reason}\``)] });
			return member.send({ embeds: [EmbedBuilder.from(embed).setDescription(`Odrzucono ${zmiana == "utworz" ? "tworzenie nowej" : zmiana == "kolor" ? "zmianę koloru" : "zmianę ikony"} rangi prywatnej.\nPowód: \`${reason}\``)] }).catch((e) => {});
		} catch (error) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			console.log(error);
		}
	},
};
