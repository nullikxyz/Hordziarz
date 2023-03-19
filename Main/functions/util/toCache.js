const losyModel = require("../../models/losy");
const zagadkiModel = require("../../models/messageCollector");

module.exports = async (client) => {
	let [losyData, zagadkiData] = await Promise.all([losyModel.find(), zagadkiModel.find()]);
	if (losyData.length) for (los of losyData) client.losy.set(los.trigger, los);
	if (zagadkiData.length) for (zagadka of zagadkiData) client.zagadki.set(zagadka.channelId, zagadka);
};
