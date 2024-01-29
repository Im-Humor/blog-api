const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const { authUser } = require("../middlewares.js");
const Post = require("../models/post.js");

//import controller
const user_controller = require("../controllers/userController.js");

// server side form validation functions
function checkAlphaExists(input) {
	return body(input).notEmpty().isAlpha().isLength({ max: 100 });
}
function checkAlphaNumExists(input) {
	return body(input).notEmpty().isAlpha().isLength({ max: 100 });
}

router.post(
	"/login",
	body("username").notEmpty(),
	body("password").notEmpty(),
	user_controller.loginPost
);

router.post(
	"/create",
	checkAlphaExists("first_name"),
	checkAlphaExists("last_name"),
	body("email").notEmpty().isEmail(),
	checkAlphaNumExists("username"),
	body("password").notEmpty().isLength({ max: 1000 }),
	authUser(),
	user_controller.createPost
);

router.get("/posts", authUser(), async (req, res) => {
	try {
		const posts = await Post.find({ author: res.locals.user._id }).sort({
			date: -1,
		});
		res.send(posts);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
});

router.get("/authuser", authUser(), async (req, res) => {
	try {
		res.sendStatus(200);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
});

module.exports = router;
