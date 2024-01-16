const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
	first_name: String,
	last_name: String,
	email: String,
	username: String,
	password: String,
	date: { type: Date, default: Date.now },
	posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
