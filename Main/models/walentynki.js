const { Schema, model } = require("mongoose");

const ListaWalentynek = new Schema({
	from: { type: String, require: true },
	to: { type: String, require: true },
	code: { type: String, require: true },
	text: { type: String, require: true },
});

const Walentynki = (module.exports = model("walentynki", ListaWalentynek, "walentynki"));
