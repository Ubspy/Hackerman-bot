/**
 * @file reddit.js
 * @author Ubspy
 * @desc
  Whenever 'r/' is detected in a message it will check if a subreddit exists.
  If it doesn't, it won't reply if this happens check the
  logger.
 *
 * @param {discord.js <Message>}, Message [Message object to work with]
   {@link} https://discord.js.org/#/docs/main/stable/class/Message
 * @param {log4js <Logger>}, Logger to output logging to file
   {@link} https://www.npmjs.com/package/log4js
 */

 // Getting needed libraries
const request = require('request');

// This returns a function with the passing parameters "message" and "logger"
module.exports = (message, logger) =>
{
    // Gets the name of the subreddit by splitting the message between the r/ and the next space
    var subreddit = message.content.split("r/")[1].split(" ")[0].toLowerCase();

    // After taking a look at the reddit json, there's a property called 'dist' that is 0 for subs that do not exist
    // I have no idea what it means, but we'll use that to make sure it exists
    request({
        url:`https://www.reddit.com/r/${subreddit}.json`,
        json: true
    }, (error, response, body) => {
        if(error)
        {
            logger.error(`Something went horribly wrong when looking for subreddit ${subreddit}: ` + error);
            message.channel.send("Something went horribly wrong, please check the log files");
        }
        else if(body.data.dist > 0)
        {
            logger.debug("Subreddit hyper-linked: " + subreddit);
            message.channel.send("OwO, what's this? Subreddit link: https://reddit.com/r/" + subreddit);
        }
    });
};
