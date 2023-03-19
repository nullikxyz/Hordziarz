const { Schema, model } = require("mongoose");

const activeCollectorsList = new Schema({
	channelId: String,
	type: String,
	end: Number,
	value: Object,
});

const CollectorsActive = (module.exports = model("collectory_aktywne", activeCollectorsList, "collectory_aktywne"));
