const express = require("express");
const Comment = require("../models/comment");
const Post = require("../models/post");
const { authUser } = require("../middlewares");
const router = express.Router({ mergeParams: true });

module.exports = router;

//publish comment to post
router.post("/", async (req, res) => {
	try {
		const post = await Post.findById(req.params.postId);
		const comment = await Comment.create({
			author_name: req.body.name,
			post: req.params.postId,
			content: req.body.content,
		});
		await post.comments.push(comment._id);
		post.save();
		res.sendStatus(200);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
});

router.delete("/:commentId", authUser(), async (req, res) => {
	try {
		const comment = await Comment.findById(req.params.commentId);
		console.log(comment);
		const post = await Post.findById(comment.post);
		console.log(post.comments);
		post.comments.splice(post.comments.indexOf(comment._id), 1);
		console.log(post.comments);
		await post.save();
		await Comment.deleteOne({ _id: comment._id });
		res.sendStatus(200);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
});
