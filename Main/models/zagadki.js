const { Schema, model } = require("mongoose");

const zagadkiLista = new Schema({
    type: String,
    category: String,
    correct: String,
    aliases: { type: Array, of: String},
    emotes: String,
});

const Zagadki = (module.exports = model("zagadki", zagadkiLista, "zagadki"));