const { Schema, model } = require("mongoose");

const UserProfile = new Schema({
	userId: String,
	banner: String,
	ulubiency: { type: Array, of: String},
	kolory: { type: Array, of: String },
	eventy: { sum: { type: Number, default: 0 }, list: {type: Array} },
	zgadywanki: { literki: { type: Number }, emotki: { type: Number } },
	zgp: { type: Array, of: String },
	reputacja: { plus: { type: Array, of: String }, minus: { type: Array, of: String } },
	views: Number,
});

const Profil = (module.exports = model("profil", UserProfile, "profil"));


