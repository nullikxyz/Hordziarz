const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const takNieCollector = require("../../functions/util/takNieCollector");

module.exports = {
	name: "burdel",
	async execute(client, interaction) {
		try {
			await interaction.deferReply({ ephemeral: true });
			let akcja = interaction.customId.split("-")[1];

			if (akcja == "event_kanal") {
				let channel = await interaction.guild.channels.create({
					name: `Eventˑ${interaction.user.tag}`,
					type: 0,
					topic: `Kanał eventowy stworzony przez: ${interaction.user.tag}`,
					parent: client.config.channels.burdelEvent,
					lockPermissions: true,
				});
				channel.permissionOverwrites.edit(interaction.member.id, { ViewChannel: true, SendMessages: true, ManageChannels: true, ManageRoles: true });

				client.success(interaction, { description: `<:yes:942751104662396948> Twój kanał został utworzony! Przejdź do <#${channel.id}>!` }, [], true);
				let msg = await channel.send({
					content: `<@${interaction.member.id}>`,
					embeds: [
						new EmbedBuilder()
							.setAuthor({ name: interaction.member.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
							.setColor(client.config.embedHex)
							.setDescription("Witaj na kanale! Przedstaw tu swój pomysł na event. Zmień nazwę kanału na nazwę eventu jaki chcesz przeprowadzić. Jeżeli chcesz przeprowadzić go z kimś jeszcze, dodaj go do kanału."),
					],
					components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("burdel-event_usun").setStyle("Danger").setLabel("Usuń kanał").setEmoji("<:icons_delete:867650498030731315>")])],
					allowedMentions: { users: [interaction.member.id] },
				});
				await msg.pin();
			} else if (akcja == "event_usun") {
				const row = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("takczynie-tak").setEmoji("<:yes:942751104662396948>").setStyle("Success"), new ButtonBuilder().setCustomId("takczynie-nie").setEmoji("<:no:942751104708538419>").setStyle("Danger")]);
				const pytanie = await interaction.editReply({ embeds: [new EmbedBuilder().setColor("Red").setDescription("CZY NAPEWNO CHCESZ USUNĄĆ TEN KANAŁ??????????????????????????? ZASTANÓW SIĘ! TO DECYZJA OSTATECZNA!!!!!!!")], components: [row] });
				if (await takNieCollector(interaction, pytanie, 10)) return interaction.channel.delete(`${interaction.member.id} usunął kanał eventowy.`);
				else return client.error(interaction, { description: "Wstrzymano usuwanie kanału." });
			}
		} catch (e) {
			console.log(e);
		}
	},
};
