module.exports = (string, res) => {
	if (typeof string != "string") return false;

	const match = string.match(/\d+(y|mo|w|d|h|m|s)/gi);
	if (!match) return false;

	let ms = 0;
	for (let group of match) {
		switch (group.match(/[a-z]+/gi)[0].toLowerCase()) {
			case "y":
				ms += parseInt(group) * 365 * 24 * 60 * 60 * 1000;
				break;
			case "mo":
				ms += parseInt(group) * 30 * 24 * 60 * 60 * 1000;
				break;
			case "w":
				ms += parseInt(group) * 7 * 24 * 60 * 60 * 1000;
				break;
			case "d":
				ms += parseInt(group) * 24 * 60 * 60 * 1000;
				break;
			case "h":
				ms += parseInt(group) * 60 * 60 * 1000;
				break;
			case "m":
				ms += parseInt(group) * 60 * 1000;
				break;
			case "s":
				ms += parseInt(group) * 1000;
				break;
			default:
				break;
		}
	}

	return ms;
};
