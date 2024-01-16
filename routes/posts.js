const express = require("express");
const router = express.Router();
const commentRouter = require("./comments");
const { authUser } = require("../middlewares");
const Post = require("../models/post");

router.use("/:postId/comments", commentRouter);

//create new post
router.post("/", authUser(), async (req, res) => {
	try {
		await Post.create({
			author: res.locals.user._id,
			title: req.body.title,
			content: req.body.content,
			published: req.body.published,
		});
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
	res.sendStatus(200);
});

module.exports = router;
