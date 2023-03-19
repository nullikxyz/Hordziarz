const { SlashCommandBuilder } = require("@discordjs/builders");
const voice = require("../../../models/kanaly_glosowe");
const moment = require("moment");

const ms = require("../../../functions/time/parseDuration");
const { setCooldown, checkCooldown } = require("../../../functions/client/cooldown");
const humanizeDuration = require("../../../functions/time/humanizeDuration");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("głosowe")
		.setDescription("Komenda do zarządzania prywatnymi kanałami głosowymi.")
		.addSubcommand((sc) =>
			sc
				.setName("info")
				.setDescription("Pozyskaj wiecej informacji o kanale.")
				.addChannelOption((channel) => channel.setName("kanał").setDescription("Kanał, o którym chcesz dowiedzieć się więcej.").addChannelTypes(2))
		)
		.addSubcommand((sc) => sc.setName("zablokuj").setDescription("Zablokuj kanał dla użytkowników."))
		.addSubcommand((sc) => sc.setName("odblokuj").setDescription("Odblokuj kanał dla użytkowników."))
		.addSubcommand((sc) => sc.setName("przejmij").setDescription("Przejmij kontrolę nad kanałem."))
		.addSubcommand((sc) =>
			sc
				.setName("oddaj")
				.setDescription("Oddaj kontrolę nad kanałem.")
				.addUserOption((user) => user.setName("osoba").setDescription("Komu chcesz oddać kontrolę nad kanałem.").setRequired(true))
		)
		.addSubcommand((sc) =>
			sc
				.setName("nazwa")
				.setDescription("Zmien nazwę kanału.")
				.addStringOption((string) => string.setName("nazwa").setDescription("Nowa nazwa kanału.").setRequired(true))
		)
		.addSubcommand((sc) =>
			sc
				.setName("limit")
				.setDescription("Zmien limit osób na kanale.")
				.addIntegerOption((integer) => integer.setName("limit").setDescription("Nowy limit kanału.").setMaxValue(99).setMinValue(0).setRequired(true))
		)
		.addSubcommand((sc) =>
			sc
				.setName("wywal")
				.setDescription("Wywala osobę z kanalu.")
				.addUserOption((user) => user.setName("osoba").setDescription("Kogo chcesz wywalić z kanału.").setRequired(true))
		)
		.addSubcommand((sc) =>
			sc
				.setName("zbanuj")
				.setDescription("Banuje osobę na kanale.")
				.addUserOption((user) => user.setName("osoba").setDescription("Kogo chcesz zbanować na kanale.").setRequired(true))
		)
		.addSubcommand((sc) =>
			sc
				.setName("odbanuj")
				.setDescription("Odbanuj osobę na kanale.")
				.addUserOption((user) => user.setName("osoba").setDescription("Kogo chcesz odbanować na kanale.").setRequired(true))
		)
		.addSubcommandGroup((scg) =>
			scg
				.setName("dodaj")
				.setDescription("Dodaj możliwość dołączenia do kanału gdy jest zablokowany.")
				.addSubcommand((sc) =>
					sc
						.setName("osoba")
						.setDescription("Dodaj osobie możliwość dołączenia do kanału gdy jest zablokowany.")
						.addUserOption((user) => user.setName("osoba").setDescription("Komu chcesz dać możliwość dołączenia.").setRequired(true))
				)
				.addSubcommand((sc) =>
					sc
						.setName("ranga")
						.setDescription("Dodaj randze możliwość dołączenia do kanału gdy jest zablokowany.")
						.addRoleOption((user) => user.setName("ranga").setDescription("Jakiej randze chcesz dać możliwość dołączenia.").setRequired(true))
				)
		)
		.addSubcommandGroup((scg) =>
			scg
				.setName("usuń")
				.setDescription("Zabierz możliwość dołączenia do kanału gdy jest zablokowany.")
				.addSubcommand((sc) =>
					sc
						.setName("osoba")
						.setDescription("Zabierz osobie możliwość dołączenia do kanału gdy jest zablokowany.")
						.addUserOption((user) => user.setName("osoba").setDescription("Komu chcesz dać możliwość dołączenia.").setRequired(true))
				)
				.addSubcommand((sc) =>
					sc
						.setName("ranga")
						.setDescription("Zabierz randze możliwość dołączenia do kanału gdy jest zablokowany.")
						.addRoleOption((user) => user.setName("ranga").setDescription("Jakiej randze chcesz dać możliwość dołączenia.").setRequired(true))
				)
		),
	async execute(client, interaction) {
		let akcja = interaction.options.getSubcommand();
		try {
			let kanal = interaction.options.getChannel("kanał");

			let data = await voice.findOne({ channelId: kanal?.id || interaction.member.voice.channelId });
			if (!data) return client.error(interaction, { description: "Kanał nie jest prywatnym kanałem głosowym." });

			let tenKanal = interaction.guild.channels.cache.get(data.channelId);
			let owner = null;
			try {
				owner = await interaction.guild.members.fetch(data.ownerId);
			} catch (error) {}
			if (akcja === "info") return client.success(interaction, { description: `Kanał: ${tenKanal} \`${tenKanal.name}\`\nIlość osób: \`${tenKanal.members.size}/${tenKanal.userLimit ? tenKanal.userLimit : "∞"}\`\nWłaściciel: ${owner?.voice.channelId == data.channelId ? `${owner} \`[${owner.user.tag}]\`` : "*`Brak`*"}\nUtworzono: \`${moment(tenKanal.createdAt).format("DD.MM.YYYY kk:mm")}\`` });
			else if (akcja === "przejmij") {
				if (interaction.member.id === data.ownerId) return client.error(interaction, { description: "Jesteś już właścicelem tego kanału!" });
				if (await voice.findOne({ ownerId: interaction.member.id })) return client.error(interaction, { description: "Jesteś już właścicielem innego kanału!" });
				if (owner?.voice.channelId === tenKanal.id) return client.error(interaction, { description: "Właściciel nadal znajduje się na kanale!" });
				let permament = ["896645224502288464", "896645249001213972", "896645270987751464", "896645291795705866"];
				if (owner?.roles.cache.some((r) => permament.includes(r.id))) return client.error(interaction, { description: "Kanał jest kanałem permamentnym. Nie możesz go przejmować." });

				await tenKanal.permissionOverwrites.edit(interaction.member.id, { Connect: true, Speak: true });
				tenKanal.permissionOverwrites.delete(data.ownerId);
				data.ownerId = interaction.member.id;
				data.save().catch((e) => console.log(e));

				return client.success(interaction, { description: `Przekazano uprawnienia do kanału ${tenKanal}` });
			} else {
				if (interaction.member !== owner) return client.error(interaction, { description: "Nie jesteś właścicielem kanału!" });
				let osoba = interaction.options.getMember("osoba") || interaction.options.getRole("ranga");
				if (osoba === interaction.member) return client.error(interaction, { description: "Nie możesz zarządzać samym sobą!" });

				switch (akcja) {
					case "zablokuj":
						await tenKanal.permissionOverwrites.edit(interaction.guild.id, { Connect: false });
						client.success(interaction, { description: "Poprawnie zablokowano kanał!" });
						break;

					case "odblokuj":
						await tenKanal.permissionOverwrites.edit(interaction.guild.id, { Connect: true });
						client.success(interaction, { description: "Poprawnie odblokowano kanał!" });
						break;

					case "oddaj":
						if (osoba.voice.channelId !== tenKanal.id) return client.error(interaction, { description: "Osoba musi znajdować się na twoim kanale głosowym!" });
						if (await voice.findOne({ ownerId: osoba.id })) return client.error(interaction, { description: "Osoba jeste już właścicielem innego kanału!" });
						tenKanal.permissionOverwrites.edit(osoba.id, { Connect: true, Speak: true });
						tenKanal.permissionOverwrites.delete(interaction.member.id);
						data.ownerId = osoba.id;
						data.save().catch((e) => console.log(e));
						client.success(interaction, { description: `Przekazano kontrolę nad kanałem do ${osoba}` });
						break;

					case "nazwa":
						let permAllow = ["896645224502288464", "896645249001213972", "896645270987751464", "896645291795705866"];
						let nazwa = interaction.options.getString("nazwa");
						if (nazwa === tenKanal.name) return client.error(interaction, { description: "Ten kanał posiada już taką nazwę" });
						if (nazwa.includes("🅿") && !interaction.member.roles.cache.some((x) => permAllow.includes(x.id))) return client.error(interaction, { description: "Znak `🅿` jest przeznaczony dla kanałów  permanentnych." });
						if (await checkCooldown(client, tenKanal.id, "voice-zmianaNazwy")) return client.error(interaction, { description: `Nastepna dostepna zmiana nazwy tego kanału za: \`${humanizeDuration((await checkCooldown(client, tenKanal.id, "voice-zmianaNazwy")) - Date.now())}\`` });
						await setCooldown(client, tenKanal.id, "voice-zmianaNazwy", Date.now() + ms("10m"));
						if (nazwa.length < 3 || nazwa.length > 32) return client.error(interaction, { description: "Nazwa kanału musi zawierać od 3 do 32 znaków." });
						tenKanal.setName(nazwa);
						client.success(interaction, { description: `Poprawnie zmieniono nazwę kanału na: \`${nazwa}\`` });
						break;

					case "limit":
						let limit = interaction.options.getInteger("limit");
						if (limit === tenKanal.userLimit) return client.error(interaction, { description: `Limit jest już ustawiony na \`${limit}\`` });
						tenKanal.edit({ userLimit: limit });
						client.success(interaction, { description: `Zmieniono limit osób na: \`${limit ? `${limit}` : "nieograniczony"}\`\n${limit && limit < tenKanal.members.size ? `*Uwaga na kanale znajdują się teraz ${tenKanal.members.size - limit} osób wiecej niż wynosi limit!*` : ""}` });
						break;

					case "wywal":
						if (osoba.voice.channelId !== tenKanal.id) return client.error(interaction, { description: "Podana osoba nie jest na twoim kanale glosowym." });
						osoba.voice.disconnect().catch((e) => console.log(e));
						client.success(interaction, { description: `Wywalono ${osoba} z kanału.` });
						break;
					case "zbanuj":
						if (!osoba) return client.error(interaction, { description: `Podany użytkownik wyszedł z serwera` });
						if (!tenKanal.permissionsFor(osoba.id).serialize()["Connect"]) return client.error(interaction, { description: `Użytkownik ${osoba} jest już zbanowany na tym kanale.` });
						if (osoba.voice.channelId === tenKanal.id) osoba.voice.disconnect().catch((e) => console.log(e));
						tenKanal.permissionOverwrites.edit(osoba.id, { Connect: false, Speak: false });
						client.success(interaction, { description: `Poprawnie zbanowano ${osoba} na kanale.` });
						break;

					case "odbanuj":
						if (tenKanal.permissionsFor(osoba.id).serialize()["Connect"]) return client.error(interaction, { description: `Użytkownik ${osoba} nie jest zbanowany na tym kanale.` });
						tenKanal.permissionOverwrites.delete(osoba.id);
						client.success(interaction, { description: `Poprawnie odbanowano ${osoba} na kanale.` });
						break;

					case "osoba":
						if (interaction.options.getSubcommandGroup() === "dodaj") {
							if (!tenKanal.permissionsFor(osoba.id).serialize()["Speak"]) return client.error(interaction, { description: `Aby to zrobić najpierw odbanuj ${osoba} na kanale.` });
							await tenKanal.permissionOverwrites.edit(osoba.id, { Connect: true });
							client.success(interaction, { description: `Poprawnie udzielono dostępu ${osoba} do tego kanału.` });
						} else {
							tenKanal.permissionOverwrites.delete(osoba.id);
							client.success(interaction, { description: `Poprawnie zabrano dostęp ${osoba} do tego kanału.` });
						}
						break;

					case "ranga":
						if (interaction.options.getSubcommandGroup() === "dodaj") {
							await tenKanal.permissionOverwrites.edit(osoba.id, { Connect: true });
							client.success(interaction, { description: `Poprawnie udzielono dostępu osobom z rangą ${osoba} do tego kanału.` });
						} else {
							tenKanal.permissionOverwrites.delete(osoba.id);
							client.success(interaction, { description: `Poprawnie zabrano dostęp osobom z rangą ${osoba} do tego kanału.` });
						}
						break;
					default:
						client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
						console.log(akcja);
						break;
				}
			}
		} catch (err) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
