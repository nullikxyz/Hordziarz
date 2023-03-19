const kanaly = require("../models/kanaly_glosowe");

module.exports = async (client, oldVoice, newVoice) => {
	let permAllow = [];
	let stale = [];
	let guild = client.guilds.cache.get("");
	let member;
	try {
		member = await guild.members.fetch(newVoice.id);
	} catch (error) {}

	if (member?.roles.cache.has() && newVoice.channelId == "" && oldVoice.channelId) return member?.voice.setChannel(oldVoice.channelId);

	let createCh = guild.channels.cache.get(client.config.channels.voice);
	let voiceCh = guild.channels.cache.get(oldVoice.channelId);
	if (newVoice.channelId == createCh.id) {
		let data = await kanaly.findOne({ ownerId: member?.id });
		if (data) {
			let permVoice = guild.channels.cache.get(data.channelId);
			if (!permVoice) await kanaly.findByIdAndRemove(data._id);
			else return member?.voice.setChannel(data.channelId);
		}
		let num = guild.channels.cache.filter(x => x.parentId == createCh.parentId).size
		let newChannel = await guild.channels.create({name:`🔊・Kanał #${num - stale.length + 1}`, type: 2, parent: createCh.parentId });
		newChannel.permissionOverwrites.create(member?.id, { "Connect": true, "ManageChannels": true, "ManageRoles": false });
		await kanaly.create({ ownerId: member?.id, channelId: newChannel.id });
		member?.voice.setChannel(newChannel);
	}

	if (voiceCh && voiceCh.parentId == createCh.parentId && !stale.includes(voiceCh.id))
		if (voiceCh.members.filter((m) => m.user.bot == false).size == 0) {
			let tenKanal = await kanaly.findOne({ channelId: voiceCh.id });
			let owner;
			try {
				if(tenKanal) owner = await guild.members.fetch(tenKanal.ownerId);
			} catch (error) {}
			if (owner?.roles.cache.some((x) => permAllow.includes(x.id))) return;
			else {
				await kanaly.findOneAndRemove({ channelId: voiceCh.id });
				if (voiceCh.members) for (m of voiceCh.members) m.voice?.disconnect();
				voiceCh?.delete().catch((e) => {});
			}
		}
};
