const { Schema, model } = require("mongoose");

const ListaGlosowan = new Schema({
	userID: String,
	votes: { type: Object, of: Number, default: {}},
});

const Glosowanie = (module.exports = model("glosowania", ListaGlosowan, "glosowania"));
