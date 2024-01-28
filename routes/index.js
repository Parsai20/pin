var express = require('express');
var router = express.Router();
const userModel = require('./users')
const postModel = require('./posts');
const posts = require('./posts');
const passport = require("passport");
const localStrategy = require('passport-local')
passport.use(new localStrategy(userModel.authenticate()))
const multer = require('./multer');
const path = require('path');

const app = express();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Express' });
});

router.post('/register', function (req, res, next) {
  const userData = new userModel({
    fullname: req.body.fullname,
    username: req.body.username,
    email: req.body.email,
    number: req.body.number
  });

  userModel.register(userData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      })
    })

})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}),
  (req, res) => { }
);

router.get('/profile', isLoggedIn, async function (req, res, next) {

  let user = await userModel.findOne({
    username: req.session.passport.user
  })

    .populate("posts")
  console.log(user),
    console.log(req.file),
    res.render('profile', { user });
});

router.post('/upload', multer.single('avatar'), async (req, res, next) => {

  let user = await userModel.findOne({ username: req.session.passport.user });

  let createpost = await postModel.create({
    image: req.file.filename,
    imagetext: req.body.filecaption,
    imagedesc: req.body.description,
    user: user._id
  });

  user.posts.push(createpost._id);
  await user.save();
  res.redirect("/profile")
});


router.post('/profiledp', isLoggedIn, multer.single('avatar'), async (req, res, next) => {

  let user = await userModel.findOne({ username: req.session.passport.user });
  user.profiledp = req.file.filename;
  await user.save();
  res.redirect("/profile")
});

router.get('/add', isLoggedIn, async function (req, res, next) {

  let user = await userModel.findOne({
    username: req.session.passport.user
  })

  res.render('add', { user });
});

router.get('/feed', isLoggedIn, async function (req, res, next) {

  let user = await userModel.findOne({
    username: req.session.passport.user
  })

  let post = await postModel.find()

    .populate("user")

  res.render('feed', { user, post });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

router.get('/logout', function (req, res, next) {
  res.render('register', { title: 'Express' });
});


module.exports = router;



