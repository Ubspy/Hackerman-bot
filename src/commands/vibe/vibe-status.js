const client = require('../../bot.js').getClient();
const vibe = require('../vibe.js');

exports.name = "status";
exports.desc = "Gets the current status of the song playing";
exports.args = [];

exports.run = (message, args, logger) => {
    // Checks for a voice connection so we don't rause a null pointer (yes I know it's not Java but shut)
    if(client.voice.connections.first())
    {
        // Get info from the current song
        var currentSong = vibe.getSongFromQueue(0);

        // Get the duration the dispatcher has been playing
        // The geniuses at discord.js made this return milliseconds so we gotta convert it to regular seconds
        var timeElapsed = Math.floor(client.voice.connections.first().dispatcher.time / 1000);

        // Get the number of hours, minutes and remaining seconds in a video
        var hours = Math.floor(timeElapsed / 3600);
        var minutes = Math.floor((timeElapsed - (hours * 3600)) / 60);
        var seconds = timeElapsed - (hours * 3600) - (minutes * 60);

        // Formats the string all nice and pretty like
        if(seconds < 10)
        {
            // If seconds is single digit then we'll force a 0 to be before it in the string
            seconds = `0${seconds}`;
        }

        if(minutes < 10)
        {
            // Same thing with minutes
            minutes = `0${minutes}`;
        }

        if(hours < 10)
        {
            // Same thing with hours, shocker
            hours = `0${hours}`;
        }

        // Get time str
        var timeElapsedStr = `${minutes}:${seconds}`;

        // String holding the emojis showing the progress bar
        var progressBar = "";

        // Gets the fraction out of 20 closest to how long the song has progressed through
        var songProgress = Math.round(timeElapsed / currentSong.durationInSeconds * 20);

        // Adds the correct number of green squares and red squares to show the proper song progress
        for(var i = 0; i < 20; i++)
        {
            // Ternary for the win
            progressBar += (i < songProgress) ? ":green_square: " : ":red_square: ";
        }

        message.reply(`Now playing: "${currentSong.name}" by ${currentSong.author} \n${timeElapsedStr}/${currentSong.durationStr}: ${progressBar} \n${currentSong.videoUrl}`);
    }
    else
    {
        // If there's no voice connection then we yell at the user
        message.reply(`There isn't anything playing!`);
    }
}