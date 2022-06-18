const express = require('express');
const app = express();
require ('dotenv').config();
var Twitter = require('twitter');
 
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
var params = {screen_name: 'nodejs'};

client.get('users/show', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  } else {
    console.log(error);
  }
});

app.get("/api", (req,res) => {
    res.json({"users": ["userOne", "userTwo", "userThree"]})
})

app.listen(5000, () => {console.log("Server started on port 5000")})