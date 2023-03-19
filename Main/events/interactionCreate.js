const { InteractionType } = require("discord.js");
const { setCooldown, checkCooldown, getCooldown } = require("../functions/client/cooldown");
const humanizeDuration = require("../functions/time/humanizeDuration");
const parseDuration = require("../functions/time/parseDuration");
const colorString = require('../functions/util/colorString');

module.exports = async (client, interaction) => {
	try {
		if (interaction.type == InteractionType.ApplicationCommand) {
			const command = client.commands.get(interaction.commandName) || client.contexts.get(interaction.commandName);
			await interaction.deferReply({ ephemeral: command?.hidden})
			if (!command) return client.logger.warn(`${colorString('[COMMAND]', 'yellow')} Nie znaleziono: ${interaction.commandName}`);

			const isDev = client.config.developers.includes(interaction.user.id);
			const isAdm = interaction.member.roles.cache.some(r => Object.values(client.config.roles.adm).includes(r.id));
			const isMod = interaction.member.roles.cache.some(r => Object.values(client.config.roles.mod).includes(r.id));

			if (command.category == "Dev" && !isDev) return client.error(interaction, { description: "Nie jesteś technikiem!" });
			if (command.category == "Adm" && !isDev && !isAdm) return client.error(interaction, { description: "Nie jesteś administratorem!" });
			if (command.category == "Mod" && !isDev && !isAdm && !isMod) return client.error(interaction, { description: "Nie jesteś moderatorem!" });

			if (command.requiredRoles && !isDev) {
				const hasRole = interaction.member.roles.cache.some(r => command.requiredRoles.includes(r.id));
				if (!hasRole) return client.error(interaction, {
					description: "Nie posiadasz jednej z wymaganych ról",
					fields: [
						{
							name: "Wymagane role:",
							value: command.requiredRoles
								.filter(r => client.guilds.cache.get(interaction.guild.id).roles.cache.get(r))
								.map(r => `・<@&${r}>`).join("\n")
						}
					]
				});
			}

			if (interaction.commandType != 1 || isDev) return await command.execute(client, interaction);

			const cooldown = await getCooldown(client, interaction.user.id, interaction.commandName);
			if (cooldown) return client.error(interaction, { description: `Spróbuj ponownie za: \`${humanizeDuration(cooldown - Date.now())}\`` });

			await Promise.all([
				command.execute(client, interaction),
				setCooldown(client, interaction.user.id, interaction.commandName, parseDuration(command.cooldown || '5s') + Date.now())
			])

			return;
		}

		if ([InteractionType.MessageComponent, InteractionType.ModalSubmit].includes(interaction.type)) {
			const collection = interaction.type == InteractionType.MessageComponent ? client.buttons : client.modals;
			const inter = collection.get(
				interaction
					.customId
					.split('-')[0]
			);
			if (!inter) return client.logger.warn(`Nie znaleziono: ${colorString(interaction.customId, 'yellow')}`);

			return await inter.execute(client, interaction);
		}
	} catch (err) {
		client.logger.error(err);
	}
};
