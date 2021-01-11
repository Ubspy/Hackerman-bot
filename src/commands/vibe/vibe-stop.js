/**
 * @file vibe-stop.js
 * @author Ubspy
 * @desc
   Will stop the dispatcher and empty the queue
 *
 * @param {discord.js <Message>}, message [Message object to work with]
 {@link} https://discord.js.org/#/docs/main/stable/class/Message
 * @param args, arguments to the command provided by the user
 * @param {log4js <Logger>}, logger [The logger object that will write important data to the log files]
 {@link} https://log4js-node.github.io/log4js-node/
**/

const client = require('../../bot.js').getClient();
const clearQueue = require("../vibe.js").clearQueue;
const config = require('../../../config/config.json');

exports.name = "stop";
exports.desc = "Stops the audio currently being played";
exports.args = [];

exports.run = (message, args, logger) => {
	// First thing we're going to check is if they have the proper role to control the bot
	// the find function loops through all the objects and checks the properties, so if there's a role with the same name as in the config, they can control the bot
	if(message.member.roles.cache.find(role => role.name.toLowerCase() === config.djRole.toLowerCase()))
	{
		// If there's no current voice connections
		if(client.voice.connections.size == 0)
		{
			message.reply("I'm not currently vibing!")
				.catch(error => {
					logger.error(`Failed to say there there were no songs playing\n${error}`);
				});
		}
		else // Now we know that the bot is connected and playing stuff, so we'll force it to end
		{
			// Gets the voice connection
			const connection = client.voice.connections.first();

			if(connection.dispatcher)
			{
				// Clears the queue of songs
				clearQueue();

				// Tells it to stop if there's a dispatcher running and then disconnect
				connection.dispatcher.end();
				connection.disconnect();

				// We also clear the activity
				client.user.setActivity("");

				// Logs the stoping of vibes
				message.reply(`Stopping vibes...`)
					.catch(error => {
						logger.error(`Failed to notify I stopped playing songs\n${error}`);
					});

				logger.info(`Ended dispatcher`);
			}
			else
			{
				// Since there's a chance that the dispatcher stopped and the bot remained in a voice channel
				// if there's no current dispatcher then we'll just disconnect from voice
				connection.disconnect();

				message.reply(`Looks like I was already done vibing... I don't know how this happened`)
					.catch(error => {
						logger.error(`Failed to say that something funny happened\n${error}`);
					});

				logger.info(`Disconnected from voice channel`);
			}
		}
	}
	else
	{
		logger.info(`Ignored message from ${message.author.username} because he's not a dj`)
	}
}