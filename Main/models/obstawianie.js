const { Schema, model } = require("mongoose");

const ListaGier = new Schema({
	customId: { type: String },
	channelId: { type: String },
	messageId: { type: String },
	time: { type: Number },
    enabled: { type: Boolean },
	pierwsza: { name: { type: String }, votes: { type: Array, of: String } },
	druga: { name: { type: String }, votes: { type: Array, of: String } },
	remis: { active: { type: Boolean }, votes: { type: Array, of: String } },
});

const Zaklady = (module.exports = model("mundial", ListaGier, "mundial"));
