const getSongFromQueue = require('../vibe.js').getSongFromQueue;
const queueLength = require('../vibe.js').getQueueLength;

exports.name = "queue";
exports.description = "Pauses the music incase something funny happens";
exports.args = [];

exports.run = (message, args, logger) => {
    // Get the first song in queue, which will be the one currently playing
    var currentSong = getSongFromQueue(0);

    // First we're going to tell them what song we're playing
    var messageString = `Now playing: ${currentSong.name} by ${currentSong.author}\n`;

    // We're not gonna set up the formatting for the queue list
    messageString += "```"

    // If there's a queue we'll display it, otherwise we won't
    if(queueLength() > 1)
    {
        // We're going to start this at one because we already got the 1st element (or really the 0th element)
        for(var i = 1; i < queueLength(); i++)
        {
            currentSong = getSongFromQueue(i);

            // Now for each song in the queue we'll add a line with some info
            messageString += `${i}: ${currentSong.name} by ${currentSong.author}\n`;
        }
    }
    else
    {
        messageString += "There is no queue!";
    }

    // At the end we'll finish the formatted string
    messageString += "```";

    // Send the message
    message.reply(messageString).catch(error => {
        logger.error(`Failed to send song queue\n${error}`);
    });
};