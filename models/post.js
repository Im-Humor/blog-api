const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
	author: { type: Schema.Types.ObjectId, ref: "User" },
	date: { type: Date, default: Date.now },
	title: { type: String, max: 200 },
	content: String,
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	published: { type: Boolean, default: false },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
