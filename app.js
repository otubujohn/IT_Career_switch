const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const store = new session.MemoryStore();
const bodyParser = require("body-parser");
const app = express();
const alert = require("alert");
const LocalStrategy = require("passport-local").Strategy;
app.set("view engine", "ejs");

//import the util folder that contains helper functions for logging, findByUsername and creating account
const db = require("./util");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
bodyParser.urlencoded({ extended: true });
app.use(
  session({
    secret: "Astrangeword",
    cookie: { maxAge: 400000000, secure: true, sameSite: false },
    resave: false,
    saveUninitialized: false,
    store,
  })
);

passport.use(
  new LocalStrategy((username, password, done) => {
    //check if a user with username exists
    let user = db.findByUsername(username);

    if (!user) {
      console.log("user does not exist");
      return done(null, false);
      //log user does not exist to console if user does not exist.. ie if findByUsername returns false
    }

    if (password !== user.password) {
      // check for password match
      console.log("invalid password, try again");
      return done(null, false);
    }

    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser((id, done) => {
  let user = db.records.find((record) => {
    record.id === id;
  });
  if (!user) {
    return done(null, false);
  }
  return done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

app.get(["/login", "/"], (req, res) => {
  //res.render("login");
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("home");
  //res.send(db.records)
});

app.get("/success", (req, res) => {
  res.render("success", { user: req.user });
});
app.get("/record", (req, res) => {
  res.send(db.records);
});
app.post("/register", async (req, res) => {
  // extract username and password form req.body
  const { username, password } = req.body;

  //check if a user with the username exists, and redirect to login if it exists
  const member = db.findByUsername(username);
  if (member) {
    console.log(
      "user with username exists. you will now be redirected to log in"
    );
    res.redirect("/login");
  } else {
    //createNewUser and push to the records array and redirect to login
    db.records.push(db.createNewUser(username, password));
    res.redirect("/login");
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.render("success");
  }
);

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`server running on ${PORT}`));
