const process = require('process');
const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');

const PORT = process.env.PORT || 5000
var stopWords;
try {
  stopWords = fs.readFileSync(path.join(process.cwd(),'stopWords.txt'));
  
} catch (err) {
  console.error(err);
}
const stopWordsArr = stopWords.toString().split('\r\n');


require ('dotenv').config();
var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

var baseVector = [parseFloat(process.env.FOLLOWERS_PARAM),
                Date.parse(process.env.DATE_CREATED_PARAM)/(86400000*3600),
                parseFloat(process.env.TIME_BETWEEN_PARAM),
                parseFloat(process.env.MOST_FREQUENT_PARAM)];
var regex = /[.,\s]/g;

function countOccurences(corpus) {
    var obj = {};
    corpus.forEach(function(str) {
        str.split(" ").forEach(function(el, i, arr) {
            el = el.replace(regex, "");
            el = el.toLowerCase();
            
            obj[el] = obj[el] ? ++obj[el] : 1;
        });
    });
    
    return obj;
  }


function filterStopWords(dict){
    var newDict = {};
    for(var key in dict){
        if(stopWordsArr.indexOf(key) == -1){
            newDict[key] = dict[key];
        }
    }
    return newDict;
}

function getMostRelevant(corpus){
    var dict = countOccurences(corpus);
    dict = filterStopWords(dict);
    var max = 0;
    var maxKey = "";
    for(var key in dict){
        if(dict[key] > max){
            max = dict[key];
            maxKey = key;
        }
    }
    return {max, maxKey};
}

function getUserDetails(name){
    return new Promise ((resolve, reject) =>{
        client.get('users/show', {screen_name: name}, function(error, user, response) {
            if (!error) {
                followers = user.followers_count
                createDate = Date.parse(user.created_at)/(86400000 * 3600)
                imageURL = user.profile_image_url.replace('_normal','')
                resolve ({followers, createDate, imageURL})
            }
            else{
                reject(error);
            }
        })

    })
}

function getUserTweets(name){
    return new Promise ((resolve, reject) =>{
        client.get('statuses/user_timeline', {screen_name: name, count: process.env.TWEETS_TO_CHECK, tweet_mode: "extended" }, function(error, tweets, response) {
            let contents = new Array();
            let last_tweet = 0;
            let tot_between = 0;
            if (!error) {
                for(var i = 0; i < tweets.length; i++){
                    contents.push(tweets[i].full_text);
                    cur_tweet = Date.parse(tweets[i].created_at)
                    if (last_tweet != 0){
                        tot_between += last_tweet - cur_tweet;
                    }
                    last_tweet = cur_tweet;
                }
                time_between = tot_between / (tweets.length - 1);
                var mostRelevant = getMostRelevant(contents);
                time_between = time_between/60000;
                mostRelevantCount = mostRelevant.max;
                resolve( {time_between, mostRelevantCount})
            }
            else {
                reject(error);
            }
        })
    })
}

async function checkBot(name){
    name = name.replace('@','');
    retVal = [0,0,0,0];
    const details = await getUserDetails(name).catch(err => {console.log(err)});
    const tweets = await getUserTweets(name).catch(err => {console.log(err)});
    if (details == undefined || tweets == undefined){
        return undefined
    }
    retVal[0] = details.followers;
    retVal[1] = details.createDate;
    retVal[2] = tweets.time_between;
    retVal[3] = tweets.mostRelevantCount;
    
    // Calculate Cosine Similarity between retVal and baseVector
    var dot = 0;
    var mag1 = 0;
    var mag2 = 0;
    for(var i = 0; i < retVal.length; i++){
        dot += retVal[i] * baseVector[i];
        mag1 += retVal[i] * retVal[i];
        mag2 += baseVector[i] * baseVector[i];
    }
    var cosine = dot / (Math.sqrt(mag1) * Math.sqrt(mag2));
    console.log(retVal,cosine,baseVector);
    return {"imageURL":details.imageURL,cosine:cosine,username:name};
    
}

app.get("/:id", (req,res) => {
    checkBot(req.params.id).then(result => {
        if (result == undefined){
            res.status(404).send("User not found");
        }
        else{
            res.json(result);
        }
    
    })
})

checkBot("@Jokowi").then(function(value){
    console.log(value)
})

app.listen(PORT, () => {console.log("Server started on port 5000")})