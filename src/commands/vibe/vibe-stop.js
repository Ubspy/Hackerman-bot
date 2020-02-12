const client = require('../../bot.js').getClient();

exports.name = "stop";
exports.desc = "Stops the audio currently being played";
exports.args = [];

exports.run = (message, args, logger) => {
    // If there's no current voice connections
    if(client.voiceConnections.size == 0)
    {
        message.reply("I'm not currently vibing!");
    }
    else // Now we know that the bot is connected and playing stuff, so we'll force it to end
    {
        // Gets the dispatcher
        const dispatcher = client.voiceConnections.first().dispatcher;

        if(dispatcher)
        {
            // Tells it to stop if there's a dispatcher running
            dispatcher.end();
            message.reply(`Stopping vibes...`);
            logger.info(`Ended dispatcher`);
        }
        else
        {
            // Since there's a chance that the dispatcher stopped and the bot remained in a voice channel
            // if there's no current dispatcher then we'll just disconnect from voice
            client.voiceConnections.first().disconnect();
            message.reply(`Looks like I was already done vibing... I don't know how this happened`);
            logger.info(`Disconnected from voice channel`);
        }
    }
}