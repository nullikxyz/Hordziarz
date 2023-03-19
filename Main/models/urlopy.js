const { Schema, model } = require("mongoose");

const ListaUrlopow = new Schema({
	userId: String,
	time: Number,
	reason: String,
	type: String,
	role: String,
});

const Urlopy = (module.exports = model("urlopy", ListaUrlopow, "urlopy"));
