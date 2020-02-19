const client = require('../../bot.js').getClient();

exports.name = "pause";
exports.description = "Pauses the music incase something funny happens";
exports.args = [];

exports.run = (message, args, logger) => {
    // If there's no current voice connections
    if(client.voiceConnections.size == 0)
    {
        message.reply("I'm not currently vibing!");
    }
    else // Now we know that the bot is connected so we can look for the dispatcher
    {
        // Gets the dispatcher
        const dispatcher = client.voiceConnections.first().dispatcher;

        if(dispatcher)
        {
            // Tells it to stop if there's a dispatcher running
            dispatcher.pause();
            message.reply(`Pausing vibes...`);
            logger.info(`Paused dispatcher`);
        }
        else
        {
            client.voiceConnections.first().disconnect();
            message.reply(`There was nothing to unpause, so I'm disconnecting for safety`);
            logger.info(`Disconnected form voice, user tried to pause but no dispatcher was found`);
        }
    }
};