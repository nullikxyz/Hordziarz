const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { setCooldown } = require("../../functions/client/cooldown");

module.exports = {
	name: "pomysly",
	async execute(client, interaction) {
		try {
			let akcja = interaction.customId.split("-")[1];

			const id = akcja == "edytuj" ? interaction.fields.getTextInputValue("id") : "";
			const tresc = interaction.fields.getTextInputValue("tresc");

			if (akcja == "dodaj") {
				await interaction.deferReply({ ephemeral: true });

				await setCooldown(client, interaction.user.id, "pomysły", Date.now() + 3600000);

				client.success(interaction, { description: "Dodawanie propozycji" });
				const temat = interaction.fields.getTextInputValue("temat");
				let propEmbed = new EmbedBuilder()
					.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
					.setTitle(`${temat}`)
					.setColor(interaction.member.displayHexColor)
					.setImage("https://cdn.discordapp.com/attachments/780509819928313866/926156256492785744/invisible.png")
					.setDescription(`${tresc}`);
				let msg = await interaction.guild.channels.cache.get(client.config.channels.pomysly).send({
					embeds: [propEmbed],
				});
				await msg.edit({ embeds: [propEmbed.setFooter({ text: `・ID propozycji:  ${msg.id} \n・ID autora:  ${interaction.member.id}` })], components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("pomysly-opcje").setStyle("Primary").setEmoji("<:shield:836882196995375114>")])] });
				await msg.react("<a:vega_check:846039085344751626>");
				await msg.react("<a:vega_x:846040128774340648>");

				await msg.startThread({
					name: temat,
					rateLimitPerUser: 5,
					autoArchiveDuration: 4320,
				});
				client.success(interaction, { description: "Twoja propozycja została dodana poprawnie!" });
			} else if (akcja == "akceptacji" || akcja == "odrzucenia") {
				let uid;
				let embed = interaction.message.embeds[0].data;
				if (embed.footer) uid = embed.footer.text.split(" ")[3];
				else uid = embed.author.icon_url.match(/\d{17,19}/gi);

				let tablicaMsg = await interaction.guild.channels.cache.get(client.config.channels.tablica).send({
					content: `<@${uid}> | Twoja propozycja została ${akcja == "akceptacji" ? "zaakceptowana" : "odrzucona"}\n${tresc == "brak" ? "" : `Powód: ${tresc}`}`,
					embeds: interaction.message.embeds,
					allowedMentions: { users: [parseInt(uid)] },
				});

				interaction.channel.messages
					.resolve(interaction.message.id)
					?.delete()
					.catch((e) => {});

				client.channels.cache
					.get(client.config.channels.logiMain)
					.threads.cache.get(client.config.channels.tablicaLogi)
					?.send({
						embeds: [
							new EmbedBuilder()
								.setColor(akcja === "akceptacji" ? "Green" : "Red")
								.setTimestamp()
								.setTitle(`${akcja === "akceptacji" ? "Akceptacja" : "Odrzucenie"} pomysłu`)
								.setDescription(`${interaction.member} ${akcja === "akceptacji" ? "Zaakceptował/a" : "Odrzucił/a"} pomysł \`\`\`${interaction.message.embeds[0].title}\`\`\` złozony przez <@${interaction.message.embeds[0].footer.text.split(" ")[3]}>\n**[LINK DO POMYSŁU](${tablicaMsg.url})**`),
						],
					});
				return await interaction.deferUpdate();
			} else if (akcja == "edytuj") {
				await interaction.deferReply({ ephemeral: true });

                let wiadomosc = await interaction.channel.messages.resolve(id);
				if (!wiadomosc) return client.error(interaction, { description: "Nie znaleziono propozycji o podanym ID." }, [], true);
				if (interaction.member.id != wiadomosc.embeds[0].footer?.text.split(" ")[3]) return client.error(interaction, { description: "Możesz edytować tylko swoją propozycję." }, [], true);

				let msg = await interaction.channel.messages.resolve(id);

				msg.edit({ embeds: [EmbedBuilder.from(msg.embeds[0]).setDescription(`${tresc}`)] });
				client.success(interaction, { description: "Poprawnie zedytowano propozycję." });
			}
		} catch (e) {
			console.log(e);
		}
	},
};
