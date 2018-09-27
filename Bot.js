//Constants for discord client
const Discord = require('discord.js');
const client = new Discord.Client();

//Constant for commands file
const {commands} = require('./src/');
const {prefix, token} = require('./config/Bot.json')
const blacklist = [];

//On ready, output logged in message
client.once('ready', () => {
	console.log("Logged in as "+client.user.username+"#"+client.user.discriminator);
	console.log("Guild Count: "+client.guilds.array().length)
});

// Check if the bot is not talking to itself and the message's channel is not blacklisted
function verify(message) {
	if (message.content != undefined) {
		if (!blacklist.includes(message.channel.id) && message.author.id != client.user.id) {
			return true
		} else {
			return false
		}
	} else {
		return false
	}
}
// Authorization, currently only guild owner. (next should be bot owner see https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=fetchApplication)
function authorize(member) {
	if (member instanceof Discord.GuildMember) {
		if (member.id == member.guild.ownerID) {
			return true
		} else {
			return false
		}
	} else {
		return false
	}
}
//On a message, run this function
client.on('message', msg => {
	if(authorize(msg.member)) {
		if (msg.content == prefix+"blacklist") {
			blacklist.push(msg.channel.id)
		}
		if (msg.content == prefix+"unblacklist") {
			for (var i = 0; i < blacklist.length; i++) {
				if (blacklist[i] != undefined && blacklist[i] == msg.channel.id) {
					delete blacklist[i]
					msg.reply("Channel unblacklisted")
				} else {
					msg.reply("Channel is probably not blacklisted.")
				}
			} 
		}
	}
	// If the channel is not a blacklist, and is a TextChannel
	if(verify(msg)) {	
      		//Check for a space to just get the raw command
      		var endingIndex = (msg.content.indexOf(' ') > -1) ? msg.content.indexOf(' ') : msg.content.length;
      		//String to hold commands
      		var command = msg.content.substring(prefix.length, endingIndex);
		// If it's the clear command, run the clear command funciton
		if(command == prefix+"clear") {
			commands.bulkDel(msg.channel)	
			msg.reply("cleared the chat") 
		}
		if(msg.content.indexOf('r/') > -1) {
			msg.channel.send("OwO, what's this? I see a mention of a subreddit! Here's a link: "+commands.subReddit(msg));
		}
	}
	
  });

//Login command with bot token
client.login(token);
