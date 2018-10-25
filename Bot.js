const Discord = require('discord.js');
const client = new Discord.Client();
const {prefix, token} = require("./config/Bot.json")
const hacker = require('./src/')
client.on('message', (msg) => {
	console.log("Blacklist: "+blacklist)
	if (msg.author.id != client.user.id && !blacklist.includes(msg.channel.id)) {
		switch (msg.content) {
			case prefix+"clear":
				(msg.guild.me.hasPermission("MANAGE_MESSAGES") ? msg.channel.fetchMessages().then((msgs) => {msg.channel.bulkDelete(msgs)}): msg.reply("I don't have perms for that!"))
				
				break;
			case prefix+"blacklist":
				(msg.member.hasPermission("ADMINISTRATOR") ? blacklist.push(msg.channel.id):msg.reply("you need admin to do that."))
				break;
		}
		if (msg.content.includes("r/")) {
			msg.reply("OwO notices subreddit. Here's a link: "+hacker.reddit(msg.content))
		}
	}
	if (msg.content == prefix+"unblacklist") {
		(msg.member.hasPermission("ADMINISTRATOR") ? blacklist.splice(blacklist.indexOf(msg.channel.id), 1) : msg.reply("you need admin for that."))
	}
})
client.login(token)
