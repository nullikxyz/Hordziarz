module.exports = async (interaction, msg, czas = 15) => {
	const filter = (button) => {
		button.deferUpdate();
		return button.user.id === interaction.member.id;
	};
	let collector = await msg
		.awaitMessageComponent({ filter, time: czas * 1000, errors: ["time"], max: 1 })
		.then((button) => {
			if (button.customId === "takczynie-tak") return true;
			else return false;
		})
		.catch((c) => {
			if (!c.size) return false;
		});
	return collector;
};
