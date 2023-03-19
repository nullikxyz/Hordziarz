const { Schema, model } = require("mongoose");

const ListaAdwentowa = new Schema({
	day: Number,
	prize: { type: String, default: null },
	img: { type: String, default: null },
	received: { type: Array, of: String, default: [] },
});

const Adwent = (module.exports = model("adwent", ListaAdwentowa, "adwent"));
