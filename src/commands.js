const sleep = require('sleep');
const {TextChannel, GuildChanne} = require('discord.js')
//Clears the chat logs
function bulkDelete(textchan) {
	if (textchan instanceof TextChannel && textchan.memberPermissions(textchan.guild.me).has("MANAGE_MESSAGES")) {
		return true
		//Gets all messages in the bot-commands channel
		textchan.fetchMessages().then(function(messages) {
		//Bulk deletes all the messages
		textchan.bulkDelete(messages);
	});
	} else {
		return null
	}
}
function subReddit(message) {
	//Gets starting index of the subreddit
	var subCutoff = message.content.substring(message.content.indexOf('r/'), message.content.length);
	//Check for a space to just get the raw subreddit
	var endingIndex = (subCutoff.indexOf(' ') > -1) ? subCutoff.indexOf(' ') : subCutoff.length;
	//Substring for the actual subreddit
	var subredditStr = subCutoff.substring(0, endingIndex);
	return "http://reddit.com/"+subredditStr
}


module.exports.subReddit = subReddit
module.exports.bulkDel = bulkDelete
console.log("commands.js loaded")
