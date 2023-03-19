const { Schema, model } = require("mongoose");

const ListaRekrutacji = new Schema({
	userId: String,
	podania: Schema.Types.Mixed,
	count: Number,
});

const Rekrutacja = (module.exports = model("rekrutacja", ListaRekrutacji, "rekrutacja"));
