if (process.env.NODE_ENV != "production") require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./model/user.js");

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(cookieParser());

const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const usersRoute = require("./routes/user.js");

main()
  .then(() => console.log("connection is succesful!"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/data");
}

app.get("/", (req, res) => {
  res.send("this is root");
});

const sessionOptions = {
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "rishi@riri",
//     username: "rornoa zoro",
//   });
//   let registeredUser = await User.register(fakeUser, "hellomoto");
//   res.send(registeredUser);
// });

app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/user", usersRoute);

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// app.use((err, req, res, next) => {
//   let { statusCode = 500, message = "Something went wrong" } = err;
//   res.render("listings/error.ejs", { message, statusCode });
//   // res.status(statusCode).send(message);
// });

app.listen(8080, () => {
  console.log("server started");
});
