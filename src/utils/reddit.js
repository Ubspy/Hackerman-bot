/**
 * @file reddit.js
 * @author Ubspy, dylhack
 * @desc
  Whenever 'r/' is detected in a message it will check if a subreddit exists.
  If it doesn't (404, 301, etc.) it won't reply if this happens check the
  logger.
 *
 * @param {discord.js <Message>} ,essage [Message object to work with]
   {@link} https://discord.js.org/#/docs/main/stable/class/Message
 */

// Getting needed libraries
const https = require("https");

// This returns a function with the passing parameters "message" and "logger"
module.exports = message => {
	// Gets the name of the subreddit by splitting the message between the r/ and the next space
	let subreddit = message.content
		.split("r/")[1]
		.split(" ")[0]
		.toLowerCase();

	//log("Checking r/" + subreddit);

	// Checks to make sure that the subreddit actually exists
	https.get("https://www.reddit.com/r/" + subreddit, res => {
		// Status code 200 means it loaded
		if (res.statusCode == 200) {
			message.reply("OwO, what's this? Subreddit link: https://reddit.com/r/" +subreddit);
		} else {
			// This runs if there's an error
			console.log(`e`);
		}
	});
};
