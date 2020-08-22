const client = require('../../bot.js').getClient();
const config = require('../../../config/config.json');
const vibe = require('../vibe.js');

exports.name = "remove";
exports.desc = "Removes a specific song from the queue of songs";
exports.args = ['number'];

exports.run = (message, args, logger) => {
    // First thing we're going to check is if they have the proper role to control the bot
    // the find function loops through all the objects and checks the properties, so if there's a role with the same name as in the config, they can control the bot
    if(message.member.roles.cache.find(role => role.name.toLowerCase() === config["dj-role"].toLowerCase()))
    {
        if(args.length < 1) // If they don't provide a song to remove we punish them
        {
            message.reply(`You didn't specify a song to remove!`);
        }
        else if(client.voice.connections.first()) // Checks for a voice connection so we don't rause a null pointer (yes I know it's not Java but shut)
        {
            // If there IS a voice connection that means we have a queue to mess with
            // We'll grab the index from the arg array
            var songToRemove = args.shift();

            // Now we need to see if the number they provided is in the range of the queue
            if(songToRemove < vibe.getQueueLength() && songToRemove != 0)
            {
                // Now we know it falls in the queue

                // Before we remove the song we'll save its info so we can spit some of it back out
                var songRemoved = vibe.getSongFromQueue(songToRemove);

                // Since the 0th element of the queue is the current song playing, every other element will be properly indexed
                // That's also why I'm not allowing them to remove the 0th item
                vibe.removeSongFromQueue(songToRemove);

                // Notifies the user and logs it
                message.reply(`Removed song "${songRemoved.name}" by ${songRemoved.author} from the queue`);
                logger.info(`Removed song "${songRemoved.name}" by ${songRemoved.author} from the queue`);
            }
        }
        else
        {
            // If there's no voice connection then we yell at the user
            message.reply(`There isn't anything playing!`);
        }
    }
    else
    {
        logger.info(`Ignored message from ${message.author.username} because he's not a dj`)
    }
}