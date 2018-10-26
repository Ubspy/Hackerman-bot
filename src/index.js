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
module.exports = {
	/**
	 * @method reddit()
	 * @description
	 * * Returns hyperlink of the provided subreddit in a msg.
	 * @param msg Any String that includes "r/"
	 * @BUG Currently only links up to one sub reddit provided.
	 */
	reddit:(msg) => {
		let subreddit = (msg.includes("r/") ? ((msg) => {
			let x = msg.split("r/")[1]
			let y = (x.includes(" ") ? x.substring(0, x.indexOf(" ")) : x)
			return y
		})(msg) : msg.replace(" ", ""))
		return "https://reddit.com/r/"+subreddit
	},
	/**
	 * @method scp()
	 * @description
	 * * SCP lookup from 001 to 4999.
	 * @param scpid Integer String
	 */
	scp:(scpid) => {
		// Every two or one digit SCP's have zeros prefixed
		let id = (!scpid.startsWith("0") && scpid.length < 3 ?((sid)=>{
			switch(sid.length) {
				case 1:
					return "00"+sid
					break;
				case 2:
					return "0"+sid
					break;
			}
		})(scpid) : scpid)
		return "http://www.scp-wiki.net/scp-"+id
	}
}
