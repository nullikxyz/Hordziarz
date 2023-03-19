const { AttachmentBuilder } = require("discord.js");

async function getImgUrl(client, attachments, name = "Obrazek") {
	let urlArray = [];
	if (!attachments.length) throw new Error("Nie podano załączników");

	let imgChannel = client.channels.cache.get(client.config.channels.staticImg);
	for (attachment of attachments) await imgChannel.send({ content: `${name}`, files: [new AttachmentBuilder(attachment.url, { name: attachment.name })] }).then((x) => urlArray.push(x.attachments.first().url));

	return urlArray;
}

module.exports = getImgUrl;
