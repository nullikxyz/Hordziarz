const { Schema, model } = require("mongoose");

const KanalyGlosowe = new Schema({
	ownerId: String,
	channelId: String,
});

const Kanaly = (module.exports = model("kanalyGlosowe", KanalyGlosowe, "kanalyGlosowe"));
