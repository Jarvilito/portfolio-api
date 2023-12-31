const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const FacebookStrategy = require("passport-facebook").Strategy;
const InstagramStrategy = require("passport-instagram").Strategy;
const GithubStrategy = require("passport-github").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("./config/oauth");
const chalk = require("chalk");
let user = {};

let localClientUrl = "http://localhost:3000/";

// if (process.env.NODE_ENV === "development") {
//   localClientUrl = "http://localhost:3000/";
// } else {
//   localClientUrl = "https://jarvis-tech-portfolio.firebaseapp.com/";
// }

require("dotenv").config();

// Passport config

// require("./config/passport")(passport);
// app.use(cors());
// app.use(express.json());

// app.use(
//   session({
//     secret: "secret",
//     resave: true,
//     saveUnintialized: true,
//   })
// );

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: keys.FACEBOOK.clientID,
      clientSecret: keys.FACEBOOK.clientSecret,
      callbackURL: `/auth/facebook/callback`,
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(chalk.blue(JSON.stringify(profile)));
      const picture = `https://graph.facebook.com/${profile.id}/picture?width=200&height=200&access_token=${accessToken}`;

      user = { ...profile, picture };
      return cb(null, profile);
    }
  )
);

// Github Strategy
passport.use(
  new GithubStrategy(
    {
      clientID: keys.GITHUB.clientID,
      clientSecret: keys.GITHUB.clientSecret,
      callbackURL: `/auth/github/callback`,
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(chalk.blue(JSON.stringify(profile)));
      user = { ...profile };
      return cb(null, profile);
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.GOOGLE.clientID,
      clientSecret: keys.GOOGLE.clientSecret,
      callbackURL: `/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(chalk.blue(JSON.stringify(profile)));
      const picture = profile.photos
        ? profile.photos[0].value
        : "/img/faces/unknown-user-pic.jpg";
      user = { ...profile, picture };
      return cb(null, profile);
    }
  )
);

// Instagram Strategy
passport.use(
  new InstagramStrategy(
    {
      clientID: keys.INSTAGRAM.clientID,
      clientSecret: keys.INSTAGRAM.clientSecret,
      callbackURL: `/auth/instagram/callback`,
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(chalk.blue(JSON.stringify(profile)));
      user = { ...profile };
      return cb(null, profile);
    }
  )
);

const app = express();
app.use(cors());
app.use(express.json());
app.enable("trust proxy");
//Passport middleware
app.use(passport.initialize());
// app.use(passport.session());

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  `/auth/facebook/callback`,
  passport.authenticate("facebook"),
  (req, res) => {
    res.redirect(localClientUrl);
  }
);

app.get("/auth/github", passport.authenticate("github"));
app.get(
  `/auth/github/callback`,
  passport.authenticate("github"),
  (req, res) => {
    res.redirect(localClientUrl);
  }
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
app.get(
  `/auth/google/callback`,
  passport.authenticate("google"),
  (req, res) => {
    res.redirect(localClientUrl);
  }
);

// app.get("/auth/instagram", passport.authenticate("instagram"));
// app.get(
//   `${process.env.BASE_URL}/auth/instagram/callback`,
//   passport.authenticate("instagram"),
//   (req, res) => {
//     res.redirect(localClientUrl);
//   }
// );

app.get("/user", (req, res) => {
  console.log("getting user data!");
  console.log(process.env.NODE_ENV);
  res.send(user);
  user = {};
});

app.get("/auth/logout", (req, res) => {
  console.log("logging out!");

  user = {};
  res.json("Log out success.");
});

const uri = "mongodb+srv://Admin:boGfE8g7gRNVH435@cluster0.r4qlg.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const exercisesRouter = require("./routes/exercises");
const usersRouter = require("./routes/users");
const skillsRouter = require("./routes/skills");
const timelineRouter = require("./routes/timelines");
const commentsRouter = require("./routes/comments");
const replyRouter = require("./routes/reply");

app.use("/exercises", exercisesRouter);
app.use("/users", usersRouter);
app.use("/skills", skillsRouter);
app.use("/timelines", timelineRouter);
app.use("/comments", commentsRouter);
app.use("/reply", replyRouter);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("../build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "build", "index.html"));
//   });
// }

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
