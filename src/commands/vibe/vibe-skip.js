/**
 * @file vibe-skip.js
 * @author Ubspy
 * @desc
   Instructs the dispatcher 
 *
 * @param {discord.js <Message>}, message [Message object to work with]
 {@link} https://discord.js.org/#/docs/main/stable/class/Message
 * @param args, arguments to the command provided by the user
 * @param {log4js <Logger>}, logger [The logger object that will write important data to the log files]
 {@link} https://log4js-node.github.io/log4js-node/
**/

const client = require('../../bot.js').getClient();
const config = require('../../../config/config.json');

exports.name = "skip";
exports.desc = "Skips the current song being played";
exports.args = [];

exports.run = (message, args, logger) => {
	// First thing we're going to check is if they have the proper role to control the bot
	// the find function loops through all the objects and checks the properties, so if there's a role with the same name as in the config, they can control the bot
	if(message.member.roles.cache.find(role => role.name.toLowerCase() === config["dj-role"].toLowerCase()))
		{
		// Checks for a voice connection so we don't rause a null pointer (yes I know it's not Java but shut)
		if(client.voice.connections.first())
		{
			// If there IS one, we resume it so the next song (if there is one) automatically plays
			client.voice.connections.first().dispatcher.resume();

			// After that, we can end the dispatcher which will trigger the next song or cause it to disconnect
			client.voice.connections.first().dispatcher.end();

			logger.info(`Skipped playing song`);
		}
		else
		{
			// If there's no voice connection then we yell at the user
			message.reply(`There isn't anything playing!`).catch(error => {
				logger.error(`Failed say I'm skipping a song\n${error}`);
			});;
		}
	}
	else
	{
		logger.info(`Ignored message from ${message.author.username} because he's not a dj`)
	}
}