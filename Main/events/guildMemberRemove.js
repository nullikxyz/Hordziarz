const profilModel = require("../models/profil");
const zapisaneModel = require("../models/zapisRang");
const rangiModel = require("../models/rangi_prywatne");

module.exports = async (client, member) => {
	let [zapisUserData] = await Promise.all([zapisaneModel.findOne({ userId: member.id }), rangiModel.updateMany({ posiadacze: member.id }, { $pull: { posiadacze: member.id } }), profilModel.updateMany({ ulubiency: member.id }, { $pull: { ulubiency: member.id } })]);

	if (zapisUserData) {
		let roles = member.roles.cache.map((x) => x.id).filter((x) => x != member.guild.id && !Object.values(client.config.roles.adm).includes(x) && !Object.values(client.config.roles.mod).includes(x));
		let rangiDoZapisu = [];

		for (x of zapisUserData.roles) {
			if (roles.includes(x)) {
				rangiDoZapisu.push(x);
			}
		}

		await zapisaneModel.findOneAndReplace({ userId: member.id }, { userId: member.id, roles: rangiDoZapisu });
	}
};
