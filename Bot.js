/**
 * @file Bot.js
 * @version 2.0.0
 * @author devr2k, ubspy
 * @license MIT
 * @description
 * * Fill out config/Bot.json
 * * Commands:
 * * * blacklist/unblacklist 	`ignore the commands in the channel "blacklist" was delcared`
 * * * clear 									`Attempts to delete all messages in the channel.`
 * * * r/unixporn							`The bot listens for any shorthand sub reddit links and automatically sends a hyperlink to it.`
 * * * scp SCPID							`Look up an SCP by it's ID. like "!scp 1048`
 */
const Discord = require('discord.js')
const fs = require('fs')
const readline = require('readline')
const client = new Discord.Client()
const hacker = require('./src/')
// BUG: @method setup() writes to Bot.json, but if you cancel while it prompts for a token, it doesn't write anything to Bot.json, so this try statement exists to catch if JS can read Bot.json.
try {
	var {prefix, token} = require("./config/Bot.json")
} catch(err) {
	setup()
}
// Blacklist array for Channel IDs to ignore
var blacklist = []

console.log("Hackerman-bot by ubspy & devr2k")
/**
 * @method setup()
 * @description
 * * A setup script to get the bot running for future execution and current. It writes to config/Bot.json with the prompted details.
 * * If the token is outdated or doesn't work, it'll run once again the setup script.. If this continues the make an issue on the repo.
 * * see package.json
 */
function setup() {
		// Temporary Config Object
		var conf = {
			prefix:"",
			token:""
		}
		// readline to prompt for token & prefix
		let rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		})
		// Asks user for a new token
		rl.question("Token: ", (ans) => {
			conf.token = ans
			// Asks user for a prefix, if none then use none.
			rl.question("Prefix: ", (ans2) => {
				conf.prefix = ans2
				rl.close()
			})
		})
		rl.on('close', () => {
			// Write to Bot.json to save the config.
			fs.writeFile('./config/Bot.json', (JSON.stringify(conf)), 'utf8', () => {console.log("Saving..")})
			// Attempt to login using provided token.
			client.login(conf.token)
		})
}

/**
 * Discord functionality
 */
	// Once client is logged in it'll print who it is, and how many guilds it's in.
	 client.once('ready', () => {
		 console.log("Ready as: "+client.user.username)
		 console.log(`In ${client.guilds.array().length} guilds`)
	 })
	client.on('message', (msg) => {
		// Turn every msg to lowercase, because bot commands should not BE CASE SeNSITiVE
		let content = msg.content.toLowerCase()
		// Checks to see if the bot isn't talking to itself, and that the requested command isn't in a blacklisted channel
		if (msg.author.id != client.user.id && !blacklist.includes(msg.channel.id)) {
				switch (content) {
					// Clear command, bulk deletes as much as it can.
					case prefix+"clear":
						(msg.guild.me.hasPermission("MANAGE_MESSAGES") ? msg.channel.fetchMessages().then((msgs) => {msg.channel.bulkDelete(msgs)}): msg.reply("I don't have perms for that!"))
						break;
					// Pushes the channel's ID that the command was called.
					case prefix+"blacklist":
						// It makes sure that the user that requested this has ADMIN perms to do so.
						(msg.member.hasPermission("ADMINISTRATOR") ? blacklist.push(msg.channel.id):msg.reply("you need admin to do that."))
						break;
				}
				// Listens for r/. Check src/index.js @method reddit more more info.
				if (content.includes("r/")) {
					msg.reply("OwO notices subreddit. Here's a link: "+hacker.reddit(content))
				}
				// SCP Look up using the prefix "scp" and any numbers provided after it. Example: `:scp 1048`
				if (content.startsWith(prefix+"scp") && !content.includes("random")) {
					let x = parseInt(msg.content.replace(/\D+/, ''));
					(x < 4999 && x > 1 && x % 1 === 0 ? msg.reply("SCP Found: "+hacker.scp(x.toString())):msg.reply("SCP not found."))
				}
				// SCP Look up random. `:scp random` will return a random scp number between 1 and 4999.
				if (content.startsWith(prefix+"scp") && content.includes("random")) {
					msg.reply("SCP: "+hacker.scp((Math.floor(Math.random() * Math.floor(4999))).toString()))
				}
			}
		// Unblacklist the channel that the command is called. User must have ADMIN perms to do so.
		if (content == prefix+"unblacklist") {
			(msg.member.hasPermission("ADMINISTRATOR") ? blacklist.splice(blacklist.indexOf(msg.channel.id), 1) : msg.reply("you need admin for that."))
		}
	})
// Attempts to login, if it doesn't work then run @method setup()
client.login(token).catch((err) => {
			if (err.message.includes("token") || err.message.includes("login details")) {
				setup()
			} else {
				// I could sit through looking at all the possible errors, but I think this is a reasonable error log.
				console.log("Something beyond my comprehension has gone wrong.")
			}
})
