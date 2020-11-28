var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var passport = require('passport');
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;


// import "mongoose" - required for DB Access
let mongoose = require('mongoose');
// URI
let DB = require('./db');

mongoose.connect(process.env.URI || DB.URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', () => {
  console.log("Connected to MongoDB...");
});

const UserModel = require('../models/user');
const SurveyModel = require('../models/survey');


// strategy for using web token authentication
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'comp299';
var strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  try {
    const user = await UserModel.findOne({ id: jwt_payload.id });
    console.log(user);
    if (!user) {
      return next(null, false, { message: 'User not found' });
    }
    return next(null, user, { message: 'Logged in Successfully' });
  } catch (error) {
    return next(null, false, error);
  }
});
passport.use(strategy);

var app = express();
app.use(passport.initialize());
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(express.static(process.cwd() + "/public/dist/public-survey/"));
app.get('/', (req, res) => {
  return res.sendFile(process.cwd() + "/public/dist/public-survey/index.html");
});

app.get('/check', (req, res) => {
  return res.json({ "message": "Express is up- by me" });
});

// Login route - here we will generate the token - copy the token generated in the input
app.post("/login", async (req, res) => {

  if (req.body.email && req.body.password) {
    try {
      const user = await UserModel.findOne({ email: req.body.email });
      console.log(user);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      if (user.password === req.body.password) {
        // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
        var payload = { id: user.id };
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        return res.json({ message: "ok", token: token });
      } else {
        return res.status(401).json({ message: "passwords did not match" });
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  } else {
    return res.status(400).json({ message: "Invalid Inputs" });
  }
});

// POST process the New user create - CREATE
app.post('/register', (req, res, next) => {
  const user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password
  };

  UserModel.findOne({ $or: [{ email: user.email }] }, (err, doc) => {
    //The User doesn't exist => Add New User
    if (!doc) {
      UserModel.create(user, (err, userResult) => {
        if (err) {
          return res.status(400).json({ message: "There was a problem registering the user." }).end();
        }
        return res.json({ message: "The User Created Successfully", data: userResult }).end();
      });
    }
    else {
      return res.status(400).json({ message: "The User/Email is Already Exists." }).end();
    }
  });
});


// POST process the New survey - CREATE
app.post('/survey', (req, res, next) => {
  const survey = {
    age,
    country,
    email,
    firstname,
    gender,
    lastname,
    q3additional_message,
    q5additional_message1,
    q5additional_message2,
    q5additional_message3,
    question_1,
    question_2,
    question_3,
    terms,
  } = req.body;

  SurveyModel.create(survey, (err, surveyResult) => {
    if (err) {
      return res.status(400).json({ message: "There was a problem creating survey." }).end();
    }
    return res.json({ message: "Survey Created Successfully", data: surveyResult }).end();
  });
});

app.get('/survey', (req, res, next) => {
  SurveyModel.find({}, (err, surveys) => {
    if (err) {
      return res.status(404).json({
        message: 'Error while fetching widgets!',
        error: err
      });
    }

    // return with data
    return res.status(200).json({
      message: 'ok',
      data: surveys || [],
    });
  });
});


// now there can be as many route you want that must have the token to run, otherwise will show unauhorized access. Will show success 
// when token auth is successfilly passed.
app.get("/secret", passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.json("Success! You can not see this without a token");
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  return res.send('error');
});

module.exports = app;