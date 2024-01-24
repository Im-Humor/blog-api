const express = require("express");
const router = express.Router();
const commentRouter = require("./comments");
const { authUser } = require("../middlewares");
const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");

router.use("/:postId/comments", commentRouter);

//create new post
router.post("/", authUser(), async (req, res) => {
	try {
		const user = await User.findById(res.locals.user._id);
		const post = await Post.create({
			author: res.locals.user._id,
			title: req.body.title,
			content: req.body.content,
			published: req.body.published,
		});
		console.log(user);
		console.log(post);
		user.posts.push(post._id);
		user.save();
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
	res.sendStatus(200);
});

//get all published posts
router.get("/", async (req, res) => {
	try {
		const posts = await Post.find({ published: true }).sort({
			date: -1,
		});
		res.send(posts);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
});

router.get("/:postId", async (req, res) => {
	console.log("received");
	try {
		const post = await Post.findById(req.params.postId).populate(
			"comments"
		);
		res.send(post);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
});

// update post
router.post("/:postId", authUser(), async (req, res) => {
	try {
		const post = await Post.findById(req.params.postId);
		post.title = req.body.title;
		post.content = req.body.content;
		post.save();
		res.sendStatus(200);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
});

router.post("/:postId/comment", async (req, res) => {
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

module.exports = router;
