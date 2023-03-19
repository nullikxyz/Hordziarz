const { Schema, model } = require("mongoose");

const ListaLosy = new Schema({
	name: String,
    color: String,
    icon: String,
    roleId: String,
    trigger: String,
    prizes: { type: Array, of: String },
    cooldown: String,
    bonus: String,
    channels: { type: Array, of: String },
    enabled: Boolean,
});

const Losy = (module.exports = model("losy", ListaLosy, "losy"));
