const { Schema, model } = require("mongoose");

const ListaEventow = new Schema({
	name: String,
	ikona: String,
	color: String,
	channelId: String,
	webhookId: String,
	opis: String,
	zalacznik: { type: { type: String, default: null }, url: { type: String, default: null } },
	podium: { type: Object },
	zgloszenie: { messageId: { type: Array, of: String }, text: String },
	hosts: { messageId: { type: Array, of: String }, lista: { type: Array, of: String } },
	uczestnicy: { messageId: { type: Array, of: String }, lista: { type: Array, of: String } },
	rezerwowi: { messageId: { type: Array, of: String }, lista: { type: Array, of: String } },
});

const Eventy = (module.exports = model("eventy", ListaEventow, "eventy"));
