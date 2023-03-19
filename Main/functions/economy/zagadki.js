const { EmbedBuilder } = require("discord.js");
const zagadkiAktywneModel = require("../../models/messageCollector");
const profilModel = require("../../models/profil");
const zagadkiModel = require("../../models/zagadki");

async function zagadkiStart(client, type, channel) {
	let listaHasel = await zagadkiModel.find({ type: type });
	if (!listaHasel.length) return;

	let toHaslo = listaHasel[Math.floor(Math.random() * listaHasel.length)];

	let obj = { channelId: channel.id, value: toHaslo, end: Date.now() + 5 * 60 * 1000, type: "zagadki-emotkowe" };

	await Promise.all([zagadkiModel.findByIdAndRemove(toHaslo._id), zagadkiAktywneModel.create(obj)]);
	client.zagadki.set(channel.id, obj);

	channel.send({
		embeds: [
			new EmbedBuilder()
				.setTitle(`Zagadki ${type}`)
				.setColor("Green")
				.setDescription(`${type == "literki" ? "Ułóż hasło z rozsypanych literek!" : "Rozpoznaj hasło ukrywające się pod emotkami!"}\n\n${toHaslo.emotes}\n\n${toHaslo.category ? `Kategoria: **${toHaslo.category}**\n` : ""}*\`Jeżeli uważasz, że znasz poprawną odpowiedź to wyślij ją poniżej.\`*`)
				.setFooter({ text: "Czas na odpowiedź: 5 minut.", iconURL: "https://cdn.discordapp.com/emojis/964491800465276940.png" }),
		],
	});
}

async function zagadkiEnd(client, toHaslo, channel, winner) {
	await zagadkiAktywneModel.findOneAndRemove({ channelId: channel.id });
	client.zagadki.delete(channel.id);
	if (winner) {
		let nagrody = ["973177820484362261", "500", "850", "973127703010107432", "750", "1000", "250", "973177820484362261"];
		let nagroda = nagrody[Math.floor(Math.random() * nagrody.length)];

		channel.send({ embeds: [new EmbedBuilder().setTitle(`Zagadki ${toHaslo.type}`).setColor("Green").setDescription(`Gratulację ${winner}! Odgadłeś/aś poprawne hasło!\nSprawdź swoją wygraną na <#${client.config.channels.wygrane}>`)] });
		channel.guild.channels.cache.get(client.config.channels.wygrane).send({
			embeds: [
				new EmbedBuilder()
					.setTitle(`Wygrana zgadywanek ${toHaslo.type}`)
					.setColor("Green")
					.setAuthor({ name: winner.user.tag, iconURL: winner.user.displayAvatarURL({ dynamic: true }) })
					.setDescription(`Twoja wygrana to: ${channel.guild.roles.cache.get(nagroda) ? `<@&${nagroda}>` : `${nagroda} <:konopcoin:866344767192825906>`}`),
			],
		});
		if (channel.guild.roles.resolve(nagroda)) winner.roles.add(nagroda);
		else {
			let msg = await client.channels.cache.get(client.config.channels.bot_traffic).send({ content: `${winner} bank ${nagroda} Wygrana ze zgadywanek ${toHaslo.type}` });
			client.unbelieva
				.editUserBalance(client.config.servers.hordaId, winner.id, { bank: Number(nagroda) }, `Wygrana ze zgadywanek ${toHaslo.type}`)
				.then(() => msg.react("✅"))
				.catch((e) => msg.react("❌"));
		}

		let profilData = await profilModel.findOne({ userId: winner.id });

		if (!profilData) await profilModel.create({ userId: winner.id, kolory: [], eventy: { sum: 0, list: [] }, zgadywanki: toHaslo.type == "literki" ? { literki: 1, emotki: 0 } : { literki: 0, emotki: 1 }, reputacja: { plus: 0, minus: 0 }, views: 0 });
		else {
			profilData.zgadywanki[toHaslo.type] += 1;
			await profilModel.findByIdAndUpdate(profilData._id, profilData);
		}
	} else channel.send({ embeds: [new EmbedBuilder().setTitle(`Zagadki ${toHaslo.type}`).setColor("Red").setDescription(`Nikt nie odgadł hasła w odpowiednim czasie!\nPoprawne hasło to: \`${toHaslo.correct}\``)] });
}

module.exports = { zagadkiStart, zagadkiEnd };
