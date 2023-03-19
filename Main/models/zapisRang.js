const { Schema, model } = require("mongoose");

const ListaZapisanychRang = new Schema({
    userId: String,
    savedAt: Number,
    roles: { type: Array, of: String }
});

const Zapisane = (module.exports = model("zapisaneRangi", ListaZapisanychRang, "zapisaneRangi"));