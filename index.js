//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash/lowerCase")
const mongoose = require('mongoose');
const { Mongoose } = require("mongoose");
require('dotenv').config()

const port = process.env.PORT;

const mongoURL = process.env.MONGO_URL
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

mongoose.connect(mongoURL)
  .then(() => {
    app.listen(port, function () {
      console.log(`Server started on port http://localhost:${port}`);
    });
  })
  .catch(err => console.log(err))

const postsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: String
})

const Posts = mongoose.model('Posts', postsSchema)

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', async (req, res) => {
  await Posts.find({}).maxTimeMS(30000)
    .then(posts => {
      res.render('home', { homeStartingContent: homeStartingContent, posts: posts });
    })
});

app.get('/home', (req, res) => {
  res.redirect('/');
});


app.get('/about', (req, res) => {
  res.render('about', { aboutContent: aboutContent })
});

app.get('/contact', (req, res) => {
  res.render('contact', { contactContent: contactContent })
});

app.get('/compose', (req, res) => {
  res.render('compose')
});

app.post('/compose', (req, res) => {
  let title = req.body.composeTitle;
  let content = req.body.composeBody;

  const post = new Posts({
    title: title,
    body: content
  })
  post.save()
    .then(() =>
      res.redirect("/")
    )
})

app.get('/posts/:postTitle', (req, res) => {
  const requestedTitle = req.params.postTitle;
  Posts.find({ _id: requestedTitle })
    .then(posts => {
      res.render('post', { postTitle: posts[0].title, postBody: posts[0].body })
    })
    .catch(() => {
      res.render('404');
    })
})
