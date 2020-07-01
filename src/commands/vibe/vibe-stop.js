const client = require('../../bot.js').getClient();
const clearQueue = require("../vibe.js").clearQueue;

exports.name = "stop";
exports.desc = "Stops the audio currently being played";
exports.args = [];

exports.run = (message, args, logger) => {
    // If there's no current voice connections
    if(client.voice.connections.size == 0)
    {
        message.reply("I'm not currently vibing!");
    }
    else // Now we know that the bot is connected and playing stuff, so we'll force it to end
    {
        // Gets the dispatcher
        const dispatcher = client.voice.connections.first().dispatcher;

        if(dispatcher)
        {
            // Clears the queue of songs
            clearQueue();

            // Tells it to stop if there's a dispatcher running
            // We don't disconnect from vc afterwards because the dispatcher is set to trigger a voice disconnect on end IF there's no queue
            dispatcher.end();

            // Logs the stoping of vibes
            message.reply(`Stopping vibes...`);
            logger.info(`Ended dispatcher`);
        }
        else
        {
            // Since there's a chance that the dispatcher stopped and the bot remained in a voice channel
            // if there's no current dispatcher then we'll just disconnect from voice
            client.voice.connections.first().disconnect();
            message.reply(`Looks like I was already done vibing... I don't know how this happened`);
            logger.info(`Disconnected from voice channel`);
        }
    }
}