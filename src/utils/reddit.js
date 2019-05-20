/**
 * @file reddit.js
 * @author Ubspy, dylhack
 * @desc
  Whenever 'r/' is detected in a message it will check if a subreddit exists.
  If it doesn't (404, 301, etc.) it won't reply if this happens check the
  logger.
 *
 * @param {discord.js <Message>}, Message [Message object to work with]
   {@link} https://discord.js.org/#/docs/main/stable/class/Message
 */

// Getting needed libraries
const request = require('request');

// This returns a function with the passing parameters "message" and "logger"
module.exports = (message, logger) =>
{
    // Gets the name of the subreddit by splitting the message between the r/ and the next space
    var subreddit = message.content.toLowerCase().split("r/")[1].split(" ")[0].toLowerCase();

    // After taking a look at the reddit json, there's a property called 'dist' that is 0 for subs that do not exist
    // I have no idea what it means, but we'll use that to make sure it exists
    request({
        url:`https://www.reddit.com/r/${subreddit}.json`,
        json: true
    }, (error, response, body) => {
        if(error)
        {
			// This happens if the page couldn't be reached
            logger.error(`Something went horribly wrong when looking for subreddit ${subreddit}: ` + error);
            message.channel.send("Something went horribly wrong, please check the log files");
        }
        else if(body.data.dist && body.data.dist > 0)
        {
			// This only happens if it's a valid sub
            logger.debug("Subreddit hyper-linked: " + subreddit);
            message.channel.send("OwO, what's this? I see a subreddit: https://reddit.com/r/" + subreddit);
        }

        //TODO: Maybe don't link NSFW subreddits?
    });
};
