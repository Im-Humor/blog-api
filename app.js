const express = require("express");
const PORT = process.env.PORT || 5000;
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const corsOptions = {
	origin: true,
	credentials: true,
};

app.use(cors(corsOptions));

// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

//import routers
const userRouter = require("./routes/users");
const postRouter = require("./routes/posts");
const indexRouter = require("./routes/index");

//setup mongoDB connection
const mongoose = require("mongoose");

async function main() {
	try {
		await mongoose.connect(
			`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.nttendw.mongodb.net/blog_api?retryWrites=true&w=majority`
		);
	} catch (err) {
		console.log(err);
	}
}

main();

//allow requests with application/json
//and application/x-www-form-encoded or whatever
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//use cookieParser everywhere
app.use(cookieParser());

//set router middlewares
app.use("/", indexRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

app.listen(PORT, () => {
	console.log(`App started listening on port ${PORT}`);
});
