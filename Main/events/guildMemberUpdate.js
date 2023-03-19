const { ekipa_discorda } = require("../functions/client/schedules");;

module.exports = async (client, oldMember, newMember) => {
    if (oldMember.roles.cache.size != newMember.roles.cache.size) {
        let difference = newMember.roles.cache
            .filter(r => !oldMember.roles.cache.get(r.id))

        if (difference.size == 0) difference = oldMember.roles.cache
            .filter(r => !newMember.roles.cache.get(r.id))
        if (difference.size == 0) return;

        difference = difference.map(r => r.id);

        const adminRoles = Object.values(client.config.roles.adm);
        const modRoles = Object.values(client.config.roles.mod);

        const ekipaChange = 
            difference.some(r => adminRoles.includes(r) || modRoles.includes(r))

        if (ekipaChange) ekipa_discorda(client);
    }
};