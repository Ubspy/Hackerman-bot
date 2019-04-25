/**
 * @file reddit.js
 * @author dylhack
 * @desc
  Whenever 'r/' is detected in a message it will check if a subreddit exists.
  If it doesn't (404, 301, etc.) it won't reply if this happens check the
  logger.
 *
 * @param {discord.js <Message>} msg [Message object to work with]
   {@link} https://discord.js.org/#/docs/main/stable/class/Message
 */
const https = require('https');
const logger = require('../util/logger.js');
const log = logger("reddit.js", "BLUE");

module.exports = msg => {
    if (msg.content.includes('r/')) {
        let subreddit = msg.content.split("r/")[1].split(" ")[0].toLowerCase();
        log("Checking r/" + subreddit);
        https.get('https://www.reddit.com/r/' + subreddit, res => {
            log("status code: " + res.statusCode);
            if (res.statusCode == 200) {
                log("Subreddit hyper-linked: " + subreddit);
                msg.reply("https://reddit.com/r/" + subreddit);
            } else log("(" + res.statusCode + ")" + subreddit);
        })
    }
};
