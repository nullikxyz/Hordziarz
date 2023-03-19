const { EmbedBuilder } = require("discord.js");
const { checkCooldown, getCooldown, setCooldown } = require("../client/cooldown");
const humanizeDuration = require("../time/humanizeDuration");
const ms = require("../time/parseDuration");

module.exports = async (client, message, losData) => {
	if (message.member.roles.cache.some((x) => client.config.roles.inne.ekoBlock.includes(x.id))) return;
	let embed = new EmbedBuilder()
		.setTitle("Losy")
		.setColor("Red")
		.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
		.setTimestamp();
	let isDev = client.config.developers.includes(message.member.id);

	if (!losData.enabled && !isDev) return message.reply({ embeds: [embed.setDescription("Los został tymczasowo wyłączony.")] });
	if (!message.member.roles.cache.has(losData.roleId) && !isDev) return message.reply({ embeds: [embed.setDescription(`Aby użyć tego losu musisz posiadać <@&${losData.roleId}>`)] });
	let bonusNumber = -1;
	if (losData.bonus) {
		let args = message.content.trim().split(/ +/);
		if (!args[1] || !Number.isInteger(Number(args[1])) || isNaN(args[1]) || Number(args[1]) <= 0 || Number(args[1]) > losData.prizes.length) return message.reply({ embeds: [embed.setDescription(`Ten los posiada dodatkową nagrodę!\nWpisz \`${losData.trigger} <liczba od 1 do ${losData.prizes.length}>\` ||(bez <>)|| aby ją wylosować.`)] });
		bonusNumber = parseInt(args[1], 10) - 1;
	}

	if (await checkCooldown(client, message.author.id, losData.trigger) && !isDev) return message.reply({ embeds: [embed.setDescription(`Tego losu będziesz mógł użyć za: \`${humanizeDuration(await getCooldown(client, message.member.id, losData.trigger) - Date.now())}\``)] });

	message.member.roles.remove(losData.roleId);

	const numerek = Math.floor(Math.random() * losData.prizes.length);
	let nagroda = losData.prizes[numerek];

	let winString = await givePrize(client, message, nagroda, losData);

	let bonus = "",
		bonusString;
	if (bonusNumber == numerek) {
		bonusString = await givePrize(client, message, losData.bonus, losData);
		bonus = `Dodatkowo wygrałeś: ${bonusString.join(" + ")} za obstawienie poprawnego numerka!\n`;
	}

	let winEmbed = new EmbedBuilder()
		.setAuthor({ name: `${message.author.tag} | ${losData.name}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
		.setColor(losData.color)
		.setDescription(`\`\`\`\nWylosowany numerek: ${numerek + 1}\n\`\`\`\nTwoja wygrana to: ${winString.join(" + ")}\n${bonus}\nListę nagród możesz sprawdzić na: <#603331641565380618>`);

	losData.icon ? winEmbed.setThumbnail(losData.icon) : "";
	client.channels.cache
		.get(client.config.channels.wygrane)
		.send({
			embeds: [winEmbed],
		})
		.then((m) => m.react("<:yes:942751104662396948>"));

	if (losData.cooldown && !isDev) await setCooldown(client, message.member.id, losData.trigger, Date.now() + ms(losData.cooldown));

	return message.reply({ embeds: [embed.setDescription(`Sprawdź swoją wygraną na <#${client.config.channels.wygrane}>`).setColor(losData.color)] });
};

async function givePrize(client, message, prize, losData) {
	let array = [];
	for (n of prize.split("+")) {
		n = n.trim();
		if (await message.guild.roles.resolve(n)) {
			message.member.roles.add(n);
			array.push(`<@&${n}>`);
			continue;
		} else if (Number.isInteger(Number(n))) {
			array.push(`\`${n}\`<:konopcoin:866344767192825906>`);
			let msg = await client.channels.cache.get(client.config.channels.bot_traffic).send({ content: `${message.member} bank ${n} Wygrana z ${losData.name}` });
			client.unbelieva
				.editUserBalance(client.config.servers.hordaId, message.member.id, { bank: n }, `Wygrana z ${losData.name}`)
				.then(() => msg.react("✅"))
				.catch((e) => msg.react("❌"));
			continue;
		} else {
			array.push(`\`${n}\``);
			continue;
		}
	}
	return array;
}
