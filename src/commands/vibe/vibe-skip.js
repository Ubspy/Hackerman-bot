const client = require('../../bot.js').getClient();

exports.name = "skip";
exports.desc = "Skips the current song being played";
exports.args = [];

exports.run = (message, args, logger) => {
    // Checks for a voice connection so we don't rause a null pointer (yes I know it's not Java but shut)
    if(client.voice.connections.first())
    {
        // If there IS one then we can end the dispatcher which will trigger the next song
        client.voice.connections.first().dispatcher.end();

        logger.info(`Skipped playing song`);
    }
    else
    {
        // If there's no voice connection then we yell at the user
        message.reply(`There isn't anything playing!`);
    }
}