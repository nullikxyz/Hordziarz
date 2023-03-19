const rangi = require("../../models/rangi_prywatne");
const ms = require("../../functions/time/parseDuration");
const { kolor, ikona } = require("../../functions/economy/rangiPrywatne");
const { setCooldown } = require("../../functions/client/cooldown");
const { EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
	name: "ranga",
	async execute(client, interaction) {
		try {
			let akcja = interaction.customId.split("-")[1];
			akcja != "odrzuc" ? await interaction.deferReply({ ephemeral: true }) : "";
			let embed = interaction.message.embeds[0];
			let member;
			try {
				member = await interaction.guild.members.fetch(embed.footer.text);
			} catch (error) {}
			if (!member) return interaction.message.edit({ embeds: [EmbedBuilder.from(embed).setDescription("Podanej osoby nie ma już na serwerze!")], components: [] });
			let dataRanga = await rangi.findOne({ ownerId: member.id });

			if (akcja === "utworz") {
				await interaction.message.edit({ embeds: [EmbedBuilder.from(embed).setDescription(`Tworzenie <a:LoadingWin11:912288215073951776>\n*\`Może to chwilę potrwać\`*`)], components: [] });
				client.success(interaction, { description: "Tworzenie" });

				let ranga = await interaction.guild.roles.create({
					name: `Ranga ${member.user.tag.slice(0, -5)}`,
					position: interaction.guild.roles.cache.get(client.config.prywatneRangi.wyznacznik).position - 1,
					permissions: [],
					mentionable: false,
					hoist: false,
				});
				await Promise.all([
					member.roles.add(ranga.id),
					rangi.create({
						roleId: ranga.id,
						ownerId: embed.footer.text,
						color: null,
						icon: null,
						slots: 3,
						posiadacze: [embed.footer.text],
						akcja: null,
					}),
				]);

				interaction.channel.messages
					.resolve(interaction.message.id)
					?.delete()
					.catch((e) => {});

				client.channels.cache
					.get(client.config.channels.logiMain)
					.threads.cache.get(client.config.prywatneRangi.thread)
					?.send({ embeds: [EmbedBuilder.from(embed).setDescription(`${interaction.member} Utworzył/a rangę: ${ranga} \`[${ranga.name}]\``)] });

				client.success(interaction, { description: "Utworzono" });
				return member.send({ embeds: [EmbedBuilder.from(embed).setDescription("Pomyślnie utworzono rangę prywatną! Aby nią zarządzać wpisz `/ranga informacje` na kanale komend.")] }).catch((e) => interaction.message.reply("Użytkownik ma wyłączone DM"));
			} else if (akcja === "kolor") {
				await interaction.message.edit({ embeds: [EmbedBuilder.from(embed).setDescription(`Zmiana koloru <a:LoadingWin11:912288215073951776>`)], components: [] });
				let color = dataRanga.akcja.split("-")[1];

				await kolor(client, interaction, dataRanga, color);
				await setCooldown(client, interaction.member.id, "rangi-kolorZmiana", Date.now() + ms("14d"));

				interaction.channel.messages
					.resolve(interaction.message.id)
					?.delete()
					.catch((e) => {});

				client.channels.cache
					.get(client.config.channels.logiMain)
					.threads.cache.get(client.config.prywatneRangi.thread)
					?.send({ embeds: [EmbedBuilder.from(embed).setDescription(`${interaction.member} Zaakceptował/a zmianę koloru rangi <@&${dataRanga.roleId}> na \`#${color}\``)] });

				client.success(interaction, { description: "Zmieniono" });
				return member.send({ embeds: [EmbedBuilder.from(embed).setDescription(`Pomyślnie zmieniono kolor rangi na: \`#${color}\`. Następna zmiana będzie dostępna: <t:${Math.floor((Date.now() + 1209600000) / 1000)}> <t:${Math.floor((Date.now() + 1209600000) / 1000)}:R>`)] }).catch((e) => {});
			} else if (akcja === "ikona") {
				await interaction.message.edit({ embeds: [EmbedBuilder.from(embed).setDescription(`Zmiana ikony <a:LoadingWin11:912288215073951776>`)] });
				icon = dataRanga.akcja.split("-")[1];

				await ikona(client, interaction, dataRanga, icon);
				await setCooldown(client, interaction.member.id, "rangi-ikonaZmiana", Date.now() + ms("14d"));

				interaction.channel.messages
					.resolve(interaction.message.id)
					?.delete()
					.catch((e) => {});

				client.channels.cache
					.get(client.config.channels.logiMain)
					.threads.cache.get(client.config.prywatneRangi.thread)
					?.send({ embeds: [EmbedBuilder.from(embed).setDescription(`${interaction.member} Zaakceptował/a zmianę ikony rangi <@&${dataRanga.roleId}>`).setThumbnail(icon)] });

				client.success(interaction, { description: "Zmieniono" });
				return member.send({ embeds: [EmbedBuilder.from(embed).setDescription(`Pomyślnie zmieniono ikonę rangi prywatnej. Następna zmiana będzie dostępna: <t:${Math.floor((Date.now() + 1209600000) / 1000)}> <t:${Math.floor((Date.now() + 1209600000) / 1000)}:R>`)] }).catch((e) => {});
			} else if (akcja === "odrzuc") {
				return await interaction.showModal(
					new ModalBuilder()
						.setTitle("Odrzucanie próśb rang prywatnych.")
						.setCustomId(`rangaOdrzuc-${member.id}`)
						.addComponents([new ActionRowBuilder().addComponents([new TextInputBuilder().setCustomId("reason").setPlaceholder("Podaj powód odrzucania").setStyle(TextInputStyle.Short).setMinLength(3).setMaxLength(64).setLabel("Powód").setRequired(true)])])
				);
			}
		} catch (e) {
			console.log(e);
		}
	},
};
