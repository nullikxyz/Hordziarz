const { Schema, model } = require("mongoose");

const ListaInne = new Schema({
	name: String,
	value: Schema.Types.Mixed,
});

const Inne = (module.exports = model("inne", ListaInne, "inne"));
