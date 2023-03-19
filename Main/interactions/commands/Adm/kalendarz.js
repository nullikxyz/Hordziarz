const { SlashCommandBuilder } = require("@discordjs/builders");
const kalendarzModel = require("../../../models/adwent");
const staticImg = require("../../../functions/util/staticImg");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("kalendarz")
		.setDescription("Komenda do edytowania kalendarza adwentowego")
		.addSubcommandGroup((scg) =>
			scg
				.setName("edytuj")
				.setDescription("Edytowanie nagród i obrazków z kalendarza adwentowego.")
				.addSubcommand((sc) =>
					sc
						.setName("obrazek")
						.setDescription("Edytuj obrazek")
						.addIntegerOption((integer) => integer.setName("dzień").setDescription("Dizeń jaki chcesz edytować").setMinValue(1).setMaxValue(24).setRequired(true))
						.addAttachmentOption((attachment) => attachment.setName("obrazek").setDescription("Obrazek jaki ma być wyświetlany danego dnia (zostaw puste aby usunąć)"))
				)
				.addSubcommand((sc) =>
					sc
						.setName("prezent")
						.setDescription("Edytuj prezent")
						.addIntegerOption((integer) => integer.setName("dzień").setDescription("Dizeń jaki chcesz edytować").setMinValue(1).setMaxValue(24).setRequired(true))
						.addStringOption((string) => string.setName("prezent").setDescription("Prezent jaki ma być nadany danego dnia (zostaw puste aby usunąć)"))
				)
		)
		.addSubcommand((scg) =>
			scg
				.setName("wyświetl")
				.setDescription("Wyświetla przypisane nagrody oraz obrazki")
				.addIntegerOption((integer) => integer.setName("dzień").setDescription("Dizeń jaki chcesz wyświetlić (puste jeżeli wszystkie)").setMinValue(1).setMaxValue(24))
		)
		.addSubcommand((scg) => scg.setName("utwórz").setDescription("Tworzy pusty kalendarz jeżeli nie ma")),

	async execute(client, interaction) {
		try {
			const action = interaction.options.getSubcommand();
			const day = interaction.options.getInteger("dzień");
			const obrazek = interaction.options.getAttachment("obrazek");
			const prezent = interaction.options.getString("prezent");

			if (action === "obrazek") {
				if (!obrazek) {
					await kalendarzModel.findOneAndUpdate({ day: day }, { img: null });
					return client.success(interaction, { description: `Usunięto obrazek dla dnia \`${day}\`` });
				}

				if (obrazek.contentType != "image/jpeg" && obrazek.contentType != "image/png") return client.error(interaction, { description: "Błędne rozszerzenie pliku! Poprawne: `png/jpg/jpeg`." });

				const url = await staticImg(client, [obrazek], `Obrazek do kalendarza adwentowego dzień \`${day}\``);

				await kalendarzModel.findOneAndUpdate({ day: day }, { img: url[0] });

				client.success(interaction, { description: "Poprawnie zmieniono obrazek." });
			} else if (action === "prezent") {
				if (!prezent) {
					await kalendarzModel.findOneAndUpdate({ day: day }, { prize: null });
					return client.success(interaction, { description: `Usunięto prezent dla dnia \`${day}\`` });
				}
				let prezenty = [];
				for (x of prezent.split(",")) prezenty.push(x.replace(/ +/, "", 1).replace(/[<@&>]/g, ""));

				await kalendarzModel.findOneAndUpdate({ day: day }, { prize: prezenty.join("+") });

				client.success(interaction, { description: `Poprawnie ustawiono prezent dla dnia ${day}` });
			} else if (action === "wyświetl") {
				if (!day) {
					let array = await kalendarzModel.find({});
					if (!array?.length) return client.error(interaction, { description: "Brak kalendarza! Utwórz go komendą /kalendarz utwórz" });

					client.success(interaction, { description: `${printDays(interaction, array)}` });
				} else {
					let thisDay = await kalendarzModel.findOne({ day: day });
					client.success(interaction, {
						fields: [
							{ name: "Dzień", value: `${day}` },
							{ name: "Prezenty", value: `${printDays(interaction, [thisDay], true)}` },
							{ name: "Obrazek", value: `${thisDay.img ? "*Poniżej*" : "*Brak obrazka*"}` },
						],
						image: thisDay.img,
					});
				}
			} else if (action === "utwórz") {
				if (await kalendarzModel.count()) return client.error(interaction, { description: "Kalendarz już jest." });
				for (i = 1; i <= 24; i++) await kalendarzModel.create({ day: i });
				client.success(interaction, { description: "ok" });
			}
		} catch (err) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
function printDays(interaction, arr, one = false) {
	let string = "";
	for (x of arr) {
		let multi = [];
		if (!x.prize) x.prize = "Brak";
		for (n of x.prize.split("+")) {
			n = n.trim();
			if (interaction.guild.roles.cache.get(n)) multi.push(`<@&${n}>`);
			else if (Number.isInteger(Number(n))) multi.push(`\`${n}\`<:konopcoin:866344767192825906>`);
			else multi.push(`${n}`);
		}
		string += `\`${x.day}.\` - ${multi.join(" + ")} - ${x.img ? `[Obrazek](${x.img})` : "*Brak obrazka*"}\n`;
		if (one) string = `${multi.join(" + ")}`;
	}
	return string;
}
