/**
 * @file truth-counter.js
 * @author Ubspy
 * @desc
   Every week is clears out the commands channel
 *
 * @param {discord.js <Client>}, Client [Discord client object to work with]
 {@link} https://discord.js.org/#/docs/main/stable/class/Client
 * @param {log4js <Logger>}, Logger [The logger object that will write important data to the log files]
 {@link} https://log4js-node.github.io/log4js-node/
**/

var schedule = require('node-schedule');
var clear = require('../commands/clear.js');
var config = require("../../config/config.json");

exports.name = "command-channel-clearer";

exports.start = (client, logger) => {
    // Fetch the commands channel using the config
    client.channels.fetch(config.botCommandsChannelID)
        .then(commandsChannel => {
            // This job will run every sunday at 6 PM
            var clearJob = schedule.scheduleJob('? 18 * * 0', () => {
				commandsChannel.send('Performing weekly maintinance...')
					.then(message => {
						// TODO: this doesn't work :(
						// Runs the clear command, passes an empty array as the arguments since we don't need any
						//clear.run(message, [], logger);
					});
            });
        }).catch(error => {
            // If we fail, then we log a fatal error
            logger.fatal(`Failed to fetch bot-commands channel with id ${config.botCommandsChannelID}\n${error}`);
        });
}
