function parse(mess) {
	let x = mess.split("r/")[1]
	let y = (x.includes(" ") ? x.substring(0, x.indexOf(" ")) : x)
	return y
}
module.exports = {
	reddit:(msg) => {
		let subreddit = (msg.includes("r/") ? parse(msg) : msg.replace(" ", ""))
		return "https://reddit.com/r/"+subreddit
	}, 	
}
