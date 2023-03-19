const { SlashCommandBuilder } = require("@discordjs/builders");

const roles = [
	{ name: "Kolor Biały", value: "610108895238553620" },
	{ name: "Kolor Różowy", value: "610109677610467338" },
	{ name: "Kolor Czarny", value: "610109826680225812" },
	{ name: "Kolor Niebieski", value: "610109118622990358" },
	{ name: "Kolor Fioletowy", value: "610109462472032301" },
	{ name: "Kolor Seledynowy", value: "610109317978390529" },
	{ name: "Szejk", value: "610041045027258380" },
	{ name: "Bogacz", value: "610040479635079211" },
	{ name: "Inwestor", value: "610040621025198080" },
	{ name: "Milioner", value: "610040002013036545" },
	{ name: "Cashmaker", value: "610040288710230016" },
	{ name: "Król Hazardu", value: "779701743125659700" },
	{ name: "Mistrz Ruletki", value: "610040851527368721" },
	{ name: "Człowiek Pokera", value: "779432784405856267" },
	{ name: "Kapitałowy Gigant", value: "896353293050216449" },
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName("podarunek")
		.setDescription("Podaruj komuś jedną ze swoich rang.")
		.addUserOption((user) => user.setName("osoba").setDescription("Osoba, której chcesz przekazać rangę.").setRequired(true))
		.addStringOption((string) => string.setName("ranga").setDescription("Ranga jaką chcesz oddać.").addChoices(...roles).setRequired(true)),
	cooldown: "15s",
	requiredRoles: ["735473629705404525"],
	async execute(client, interaction) {
		let target = interaction.options.getMember("osoba")
		let ranga = interaction.options.getString("ranga")
		try {
			if (interaction.member.roles.cache.some((x) => client.config.roles.inne.ekoBlock.includes(x.id))) return client.error(interaction, { description: "Posiadasz rangę blokującą dostęp do ekonomi serwera." });
			if (!interaction.member.roles.cache.has(ranga)) return client.error(interaction, { description: `Nie posiadasz <@&${ranga}>` })
			if (target.roles.cache.has(ranga)) return client.error(interaction, { description: `Ta osoba posiada już <@&${ranga}>` })

			interaction.member.roles.remove(ranga, this.requiredRoles)
			target.roles.add(ranga)

			return client.success(interaction, { description: `Poprawnie przekazano <@&${ranga}> do ${target}` })
		} catch (err) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
