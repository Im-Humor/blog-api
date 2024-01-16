const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// POST on /users/login
exports.loginPost = async (req, res) => {
	const validResult = validationResult(req);
	if (validResult.isEmpty()) {
		try {
			const user = await User.findOne({
				username: req.body.username,
			});

			bcrypt.compare(
				req.body.password,
				user.password,
				(error, response) => {
					if (error) {
						console.log(error);
					}
					if (response === false) {
						res.sendStatus(401);
					}
					if (response === true) {
						jwt.sign(
							user.toJSON(),
							process.env.SECRETKEY,
							(jwtErr, token) => {
								if (jwtErr) {
									console.log(jwtErr);
								} else {
									res.cookie("access_token", token, {
										httpOnly: true,
										sameSite: "None",
									}).sendStatus(200);
								}
							}
						);
					}
				}
			);
		} catch (userErr) {
			console.log(userErr);
		}
	} else {
		res.send({ error: validResult.array() });
	}
};

// POST on /users/create
exports.createPost = (req, res) => {
	const validResult = validationResult(req);
	if (validResult.isEmpty()) {
		bcrypt.hash(req.body.password, 8, async (err, hash) => {
			if (err) {
				console.log(err);
			} else {
				try {
					console.log("user received");
					console.log(req.body);
					await User.create({
						first_name: req.body.first_name,
						last_name: req.body.last_name,
						email: req.body.email,
						username: req.body.username,
						password: hash,
					});
					res.sendStatus(200);
				} catch (error) {
					console.log(error);
				}
			}
		});
	}
	res.send({ errors: validResult.array() });
};
