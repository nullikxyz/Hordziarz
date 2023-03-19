const { Schema, model } = require("mongoose");

const ListaRang = new Schema({
    roleId: String,
    ownerId: String,
    color: String,
    icon: String,
    slots: Number,
    posiadacze: { type: Array, of: String },
    akcja: String
});

const Rangi = (module.exports = model("rengi", ListaRang, "rangi"));
