const jwt = require("jsonwebtoken");
const User = require("./models/user");

function authUser() {
	return async function (req, res, next) {
		if (!req.cookies || !req.cookies.access_token) {
			console.error("No cookies");
			res.sendStatus(403, "No cookies");
		} else {
			jwt.verify(
				req.cookies.access_token,
				process.env.SECRETKEY,
				async (err, decoded) => {
					if (err) {
						console.error(err);
						res.sendStatus(500);
					} else {
						try {
							const user = await User.findById(decoded._id);
							res.locals.user = user;
						} catch (error) {
							console.error(error);
							res.sendStatus(403, "Token user not found");
						}
						console.log("User authenticated");
						next();
					}
				}
			);
		}
	};
}

module.exports = { authUser };
