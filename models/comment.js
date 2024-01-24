const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
	author_account: { type: Schema.Types.ObjectId, default: null },
	author_name: { type: String, max: 50 },
	post: { type: Schema.Types.ObjectId, ref: "Post" },
	content: String,
	date: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
