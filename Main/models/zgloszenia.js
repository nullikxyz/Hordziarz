const { Schema, model } = require("mongoose");

const ListaZgloszen = new Schema({
    type: String,
    id: Number,
    userId: String,
    
    roleId: String,
    reportedId: String,
    message: String,

    category: String,
    closed: Boolean,
    comment: String
});

const Zgloszenia = (module.exports = model("zgloszenia", ListaZgloszen, "zgloszenia"));