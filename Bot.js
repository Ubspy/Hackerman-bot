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
try {
	// If Bot.json is empty or not readable by JS then setup()
	var {prefix, token} = require("./config/Bot.json")
} catch(err) {
	setup()
}
// Blacklist array for Channel IDs to ignore
var blacklist = []

/**
 * Initial Start
 */
console.log("Hackerman-bot by ubspy & devr2k")
function setup() {
		var conf = {
			prefix:"",
			token:""
		}
		let rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		})
		rl.question("Token: ", (ans) => {
			conf.token = ans
			rl.question("Prefix: ", (ans2) => {
				conf.prefix = ans2
				rl.close()
			})
		})
		rl.on('close', () => {
			fs.writeFile('./config/Bot.json', (JSON.stringify(conf)), 'utf8', () => {console.log("Saving..")})
			client.login(conf.token)
		})
}

/**
 * Discord functionality
 */
	 client.once('ready', () => {
		 console.log("Ready as: "+client.user.username)
		 console.log(`In ${client.guilds.array().length} guilds`)
	 })
	client.on('message', (msg) => {
		let content = msg.content.toLowerCase()
		if (msg.author.id != client.user.id && !blacklist.includes(msg.channel.id)) {
				switch (content) {
					case prefix+"clear":
						(msg.guild.me.hasPermission("MANAGE_MESSAGES") ? msg.channel.fetchMessages().then((msgs) => {msg.channel.bulkDelete(msgs)}): msg.reply("I don't have perms for that!"))
						break;
					case prefix+"blacklist":
						(msg.member.hasPermission("ADMINISTRATOR") ? blacklist.push(msg.channel.id):msg.reply("you need admin to do that."))
						break;
				}
				if (content.includes("r/")) {
					msg.reply("OwO notices subreddit. Here's a link: "+hacker.reddit(content))
				}
				if (content.startsWith(prefix+"scp") && !content.includes("random")) {
					let x = parseInt(msg.content.replace(/\D+/, ''));
					(x < 4999 && x > 1 && x % 1 === 0 ? msg.reply("SCP Found: "+hacker.scp(x.toString())):msg.reply("SCP not found."))
				}
				if (content.startsWith(prefix+"scp") && content.includes("random")) {
					msg.reply("SCP: "+hacker.scp((Math.floor(Math.random() * Math.floor(4999))).toString()))
				}
			}
		if (content == prefix+"unblacklist") {
			(msg.member.hasPermission("ADMINISTRATOR") ? blacklist.splice(blacklist.indexOf(msg.channel.id), 1) : msg.reply("you need admin for that."))
		}
	})

client.login(token).catch((err) => {
			if (err.message.includes("token") || err.message.includes("login details")) {
				setup()
			} else {
				console.log("Something beyond my comprehension has gone wrong.")
			}
})
