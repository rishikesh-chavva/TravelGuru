const express = require("express");
const app = express();
const session = require("express-session");

const sessionOptions = {
  secret: "secret",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));

app.get("/register", (req, res) => {
  let { name = "mysterio" } = req.query;
  req.session.name = name;
  res.send(req.session.name);
});

app.get("/hello", (req, res) => {
  res.send(`hello, ${req.session.name}`);
});

// app.get("/count", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   console.log(req.session.count);
//   res.send("yokoso watashino web society");
// });

app.listen(3000, () => {
  console.log("server started");
});
