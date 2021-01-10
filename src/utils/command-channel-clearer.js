var schedule = require('node-schedule');
var clear = require('../commands/clear.js');
var config = require("../../config/config.json");

module.exports = (client, logger) => {
    // Fetch the commands channel using the config
    client.channels.fetch(config.botCommandsChannelID).then(commandsChannel => {
        // This job will run every sunday at 6 PM
        var clearJob = schedule.scheduleJob('* 18 * * 0', () => {
            commandsChannel.send('Performing weekly maintinance...').then(message => {
                // Runs the clear command, passes an empty array as the arguments since we don't need any
                clear.run(message, [], logger);
            });
        });
    }).catch(error => {
        // If we fail, then we log a fatal error
        logger.fatal(`Failed to fetch bot-commands channel with id ${config.botCommandsChannelID}\n${error}`);
    });
}