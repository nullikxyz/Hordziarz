const { EmbedBuilder } = require("discord.js");

module.exports = async (client) => {
	client.error = async (interaction, { author, title, content, description, fields, footer, timestamp, thumbnail, components, color, image, files }, ephemeral = false) => {
		const embed = new EmbedBuilder().setColor(color || 0xff6961);

		if (author) embed.setAuthor(author);
		if (title) embed.setTitle(title);
		if (description) embed.setDescription(description);
		if (fields) embed.addFields(fields);
		if (footer) embed.setFooter(footer);
		if (timestamp) embed.setTimestamp(timestamp);
		if (thumbnail) embed.setThumbnail(thumbnail);
		if (image) embed.setImage(image);

		if (interaction.deferred) {
			return await interaction.editReply({
				content: content,
				embeds: [embed],
				components: components ?? [],
				ephemeral: ephemeral,
				files: files ?? [],
			});
		} else {
			return await interaction.channel.send({
				content: content,
				embeds: [embed],
				components: components ?? [],
				ephemeral: ephemeral,
				files: files ?? [],
			});
		}
	};

	client.success = async (interaction, { author, title, content, description, fields, footer, timestamp, thumbnail, components, color, image, files }, ephemeral = false) => {
		const embed = new EmbedBuilder().setColor(color || client.config.embedHex);

		if (author) embed.setAuthor(author);
		if (title) embed.setTitle(title);
		if (description) embed.setDescription(description);
		if (fields) embed.addFields(fields);
		if (footer) embed.setFooter(footer);
		if (timestamp) embed.setTimestamp(timestamp);
		if (thumbnail) embed.setThumbnail(thumbnail);
		if (image) embed.setImage(image);

		if (interaction.deferred) {
			return await interaction.editReply({
				content: content,
				embeds: [embed],
				components: components ?? [],
				ephemeral: ephemeral,
				files: files ?? [],
			});
		} else {
			return await interaction.channel.send({
				content: content,
				embeds: [embed],
				components: components ?? [],
				ephemeral: ephemeral,
				files: files ?? [],
			});
		}
	};
};
