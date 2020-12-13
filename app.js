//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

/////////////////////////////
/*-->Global Variables<--*/
const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const globalPostArr = [];

const app = express();

/*-->Global Variables<--*/

/////////////////////////

/*-->Database<--*/
mongoose.connect("mongodb://localhost/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
});

const Post = mongoose.model("Post", postSchema);

const homePost = new Post({
  title: "Home",
  body: homeStartingContent,
});

const aboutPost = new Post({
  title: "About",
  body: aboutContent,
});

const contactPost = new Post({
  title: "Contact",
  body: contactContent,
});

const defaultItems = [homePost, aboutPost, contactPost];

/*-->Database<--*/

//////////////////////////////////

/*-->Routes & Server<--*/
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res, next) => {
  Post.find({}, (err, posts) => {
    posts.forEach((post) => {
      console.log(post._id + "--->ADDED");
    });
    res.render("home", {
      homeContent: homePost,
      posts: posts,
    });
  });
});

app.get("/about", (req, res, next) => {
  res.render("about", {
    about: aboutContent,
  });
});

app.get("/contact", (req, res, next) => {
  res.render("contact", {
    contact: contactContent,
  });
});

//What happens when someone wants to view our /compose route
app.get("/compose", (req, res, next) => {
  res.render("compose");
});

/*What happens when someone wants to send data from our /compose route 
and how our server uses that data*/
app.post("/compose", (req, res, next) => {
  const post = new Post({
    title: req.body.postTitle,
    body: req.body.postBody,
  });
  post.save((err) => {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:newpost", (req, res, next) => {
  Post.find({}, (err, result) => {
    result.forEach((post) => {
      console.log(post.id);
      let newPost = req.params.newpost;
      const storedTitle = post.title;
      console.log(newPost);
      if (newPost === post.id) {
        res.render("post", {
          title: post.title,
          body: post.body,
        });
      }
    });
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
