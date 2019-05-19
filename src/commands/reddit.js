/**
 * @file reddit.js
 * @author Ubspy, dylhack
 * @desc
  Whenever 'r/' is detected in a message it will check if a subreddit exists.
  If it doesn't (404, 301, etc.) it won't reply if this happens check the
  logger.
 *
 * @param {discord.js <Message>} msg [Message object to work with]
   {@link} https://discord.js.org/#/docs/main/stable/class/Message
 */

 // Getting needed libraries
const https = require('https');
const logger = require('../util/logger.js');
const log = logger("reddit.js", "BLUE");

// This returns a function with the passing parameter "msg"
module.exports = msg =>
{
    if (msg.content.includes('r/'))
    {
        // Same thing with "let" and "var" here, they're
        let subreddit = msg.content.split("r/")[1].split(" ")[0].toLowerCase();

        log("Checking r/" + subreddit);

        // Checks to make sure that the subreddit actually exists
        https.get('https://www.reddit.com/r/' + subreddit, res =>
        {
            // Status code 200 means it loaded
            log("status code: " + res.statusCode);
            if (res.statusCode == 200)
            {
                log("Subreddit hyper-linked: " + subreddit);
                msg.reply("https://reddit.com/r/" + subreddit);
            }
            // This runs if there's an error
            else
            {
                log(`(${res.statusCode}) ` + subreddit);
            }
        })
    }
};
