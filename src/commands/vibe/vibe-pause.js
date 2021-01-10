/**
 * @file vibe-pause.js
 * @author Ubspy
 * @desc
   Pauses the music bot
 *
 * @param {discord.js <Message>}, message [Message object to work with]
 {@link} https://discord.js.org/#/docs/main/stable/class/Message
 * @param args, arguments to the command provided by the user
 * @param {log4js <Logger>}, logger [The logger object that will write important data to the log files]
 {@link} https://log4js-node.github.io/log4js-node/
**/

const config = require('../../../config/config.json');
const client = require('../../bot.js').getClient();

exports.name = "pause";
exports.description = "Pauses the music incase something funny happens";
exports.args = [];

exports.run = (message, args, logger) => {
	// First thing we're going to check is if they have the proper role to control the bot
	// the find function loops through all the objects and checks the properties, so if there's a role with the same name as in the config, they can control the bot
	if(message.member.roles.cache.find(role => role.name.toLowerCase() === config["dj-role"].toLowerCase()))
	{
		// If there's no current voice connections
		if(client.voice.connections.size == 0)
		{
			message.reply("I'm not currently vibing!");
		}
		else // Now we know that the bot is connected so we can look for the dispatcher
		{
			// Gets the dispatcher
			const dispatcher = client.voice.connections.first().dispatcher;

			if(dispatcher)
			{
				// Tells it to stop if there's a dispatcher running
				dispatcher.pause();
				message.reply(`Pausing vibes...`);
				logger.info(`Paused dispatcher`);
			}
			else
			{
				client.voice.connections.first().disconnect();
				message.reply(`There was nothing to unpause, so I'm disconnecting for safety`);
				logger.info(`Disconnected form voice, user tried to pause but no dispatcher was found`);
			}
		}
	}
}