const fs = require('fs');
const {google} = require('googleapis');
const search = google.customsearch('v1');
const ytdl = require('ytdl-core');
const config = require('../../../config/config.json');
const client = require('../../bot.js').getClient();

exports.name = "play";
exports.desc = "Plays an audio file stored on the server";
exports.args = ['file'];

exports.run = (message, args, logger) => {
    if(args.length < 1)
    {
        message.reply("You didn't specify a song to play!");
    }
    else // If all the requirements are met
    {
        songName = args.join(' ');

        // cx: custom engine key
        // q: search query
        // auth: api key
        const options = {
            cx: config.googleSearchEngineIDs.youtube,
            q: `${songName}`, // This bit removes the franchise pages from steam, because if you search like "fallout" it gives you the fallout franchise page
            auth: config.googleToken
        };

        if(client.voiceConnections.size > 0) // If there's currently anything playing
        {
            message.reply("Wait your turn! Audio is already playing, I can only do so much :(");
        }
        else
        {
            // This gets the voice channel the user is connected to
            userChannel = message.member.voiceChannel;

            if(userChannel)
            {
                // This does the actual search results
                search.cse.list(options).then(res => {
                    // Gets url from search to play
                    var videoUrl = res.data.items[0].formattedUrl;

                    // Gets the video info from ytdl
                    var videoID = ytdl.getURLVideoID(videoUrl);

                    // Gets the video info
                    ytdl.getBasicInfo(videoID).then(videoInfo => {
                        var details = videoInfo.player_response.videoDetails;

                        // Get the number of hours, minutes and remaining seconds in a video
                        var hours = Math.floor(details.lengthSeconds / 3600);
                        var minutes = Math.floor((details.lengthSeconds - (hours * 3600)) / 60);
                        var seconds = details.lengthSeconds - (hours * 3600) - (minutes * 60);

                        // Get time str
                        var time = `${minutes}:${seconds}`;

                        // Add hours onto the str only if there's at least 1 hour of video
                        time = (hours > 0) ? `${hours}:${time}` : time;

                        message.reply(`Now playing ${details.title} by ${details.author} - ${time}\n${videoUrl}`);
                    });

                    // This then joins the channel to play the stream
                    userChannel.join().then(connection => {
                        // Gets the stream and immediately dispatches it
                        const stream = ytdl(videoUrl);
                        const dispatcher = connection.playStream(stream);
        
                        // When the file is done playing
                        dispatcher.on("end", end => {
                            connection.disconnect(); // Disconnect
                            logger.info(`Played audio from ${videoUrl}`);
                        });
        
                        // If the dispatcher has an error
                        dispatcher.on("error", error => {
                            connection.disconnect();
                            logger.error(`Error while playing audio from ${videoUrl}:\n${error}`);
                        });

                    }).catch(error => { // Don't forget the error catching
                        logger.error(`Could not connect to voice channel:\n${error}`)
                    });
                }).catch(error => {
                    logger.error(`Failed google custom search:\n${error}`);
                });
            }
            else
            {
                // If the user isn't in a voice channel
                message.reply("You need to be in a voice channel >:(");
            }
        }
    }
}