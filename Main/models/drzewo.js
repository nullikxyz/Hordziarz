const { Schema, model } = require("mongoose");

const drzewo = new Schema({
    endAt: Number,
    beating: { type: Array, of: String },
});

const drzewoLista = (module.exports = model("drzewo", drzewo, "drzewo"));