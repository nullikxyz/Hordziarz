const zapisaneModel = require("../../models/zapisRang");
const prywatneModel = require("../../models/kanaly_prywatne");

module.exports = {
	name: "odzyskZapis",
	async execute(client, interaction) {
		await interaction.deferReply({ ephemeral: true });
		let akcja = interaction.customId.split("-")[1];

		if (akcja == "oddaj") {
			if (interaction.member.roles.cache.has(client.config.moderation.ban_role)) return;

			let [zapisaneUser, kanalyPrywatne] = await Promise.all([zapisaneModel.findOne({ userId: interaction.member.id }), prywatneModel.find({ $or: [{ helpers: interaction.member.id }, { ownerId: interaction.member.id }, { deny: interaction.member.id }] }), interaction.guild.roles.fetch()]);
			if (zapisaneUser) {
				if (zapisaneUser.savedAt > new Date(interaction.member.joinedAt).getTime()) return client.error(interaction, { description: "Zapis rang działa tylko po wyjśću lub banie na serwerze" });
				zapisaneUser.roles.filter((x) => interaction.guild.roles.cache.has(x));
				interaction.member.roles.add(zapisaneUser.roles);
				await zapisaneModel.findByIdAndRemove(zapisaneUser._id);
				client.success(interaction, { description: "Zapisane rangi zostały zwrócone!" });
			} else return client.error(interaction, { description: "Nie masz zapisanych rang!" });

			if (kanalyPrywatne.length) {
				for (kanal of kanalyPrywatne) {
					let channel = await interaction.guild.channels.resolve(kanal.channelId);
					if (interaction.user.id == kanal.ownerId || kanal.helpers.includes(interaction.user.id)) channel.permissionOverwrites.edit(interaction.user.id, { ManageMessages: true, ViewChannel: true, SendMessages: true });
					else if (kanal.deny.includes(interaction.user.id)) channel.permissionOverwrites.edit(interaction.user.id, { SendMessages: false }); // permisje z textPanel.js
				}
			}
		} else if (akcja == "zapisz") {
			if(!interaction.member.roles.cache.has("828664943355232266")) return client.error(interaction, {description: "Nie posiadasz wymaganej rangi <@&828664943355232266>"})
			interaction.member.roles.remove("828664943355232266");

			let zapisanyUser = await zapisaneModel.findOne({ userId: interaction.member.id });

			let role = interaction.member.roles.cache.map((x) => x.id).filter((x) => x != "828664943355232266" && x != interaction.guild.id && !Object.values(client.config.roles.adm).includes(x) && !Object.values(client.config.roles.mod).includes(x));
			if (!zapisanyUser) zapisanyUser = await zapisaneModel.create({ userId: interaction.member.id, savedAt: Date.now(), roles: role });
			else await zapisaneModel.findByIdAndUpdate(zapisanyUser._id, { roles: role, savedAt: Date.now() });

			return client.success(interaction, { description: `Zapisano ${role.length} rang!` });
		}
	},
};
