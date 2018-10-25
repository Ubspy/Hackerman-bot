/**
 * @file index.js
 * @author devr2k, ubspy
 * @version 2.0.0
 * @license MIT
 * @description
 * * Main file for Hackerman-bot
 * @TODO:
 * * Logger, for logging.
 * * Steam integration
 * * * Search for a game
 * * * Search for a profile
 * * * Search for an item on a community market
 */
function parse(mess) {
	let x = mess.split("r/")[1]
	let y = (x.includes(" ") ? x.substring(0, x.indexOf(" ")) : x)
	return y
}
module.exports = {
	/**
	 * @method reddit()
	 * @param msg Any String that includes "r/"
	 * @BUG Currently only links up to one sub reddit provided.
	 */
	reddit:(msg) => {
		let subreddit = (msg.includes("r/") ? parse(msg) : msg.replace(" ", ""))
		return "https://reddit.com/r/"+subreddit
	},
}
