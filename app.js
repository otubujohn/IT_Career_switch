const express = require("express");
const passport = require("passport");
const session = require("express-session");
const store = new session.MemoryStore();
const bodyParser = require("body-parser");
const app = express();
const LocalStrategy = require("passport-local").Strategy;
app.set("view engine", "ejs");
const db = require("./util")
app.use(bodyParser.json());
bodyParser.urlencoded({ extended: true });
app.use(
  session({
    secret: "Astrangeword",
    cookie: { maxAge: 40000, secure: true, sameSite: "none" },
    resave: false,
    saveUninitialized: false,
    store,
  })
);




passport.use(
  new LocalStrategy((username, password, done) => {
    let user = db.findByUsername(username);
     if (!user) {
       console.log("user does not exist");
       return done(null, false);
     }

     if (password !== user.password) {
       console.log("invalid password, try again");
       return done(null, false);
     }

     return done(null, user);
   }
 ));

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser((id, done) => {
    let user = db.records.find(record=>{record.id === id})
    if (!user) {return done(null, false);}
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


app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const member = db.findByUsername(username)
  if (member) {
    res.render("login");
  }else{
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

app.get("/logout", (req, res) => {
  req.logout();
  res.render("login");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`server running on ${PORT}`));
