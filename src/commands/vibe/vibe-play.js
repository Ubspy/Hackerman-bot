const fs = require('fs');
const {google} = require('googleapis');
const search = google.customsearch('v1');
const ytdl = require('ytdl-core');
const config = require('../../../config/config.json');
const client = require('../../bot.js').getClient();
const addSongToQueue = require('../vibe.js').addSongToQueue;

exports.name = "play";
exports.desc = "Plays an a video from youtube, also resumes the player when paused";
exports.args = ['file'];

exports.run = (message, args, logger) => {
    if(args.length < 1)
    {
        // We're going to check and see if the bot is connected to any voice channels
        if(client.voiceConnections.first())
        {
            // If it is then we'll look for a dispatcher to resume
            const dispatcher = client.voiceConnections.first().dispatcher;

            if(dispatcher)
            {
                // If there's a dispatcher to be resumed, then we'll resume it
                dispatcher.resume();
                message.reply(`Resuming vibes...`);
                logger.info(`Dispatcher resumed`);
            }
            else
            {
                // If there's no dispatcher but they tried to play something
                client.voiceConnections.first().disconnect();
                logger.info(`Disconnected form voice, user tried to resume but no dispatcher was found`);
                message.reply(`There was nothing to resume, so I disconnected from voice \nTry specifying a song to play`);
            }
        }
        else
        {
            // We get here if they're not connected to a voice channel
            message.reply(`You didn't specify a song for me to play >:(`);
        }
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

                    // We're gonna add the song to the queue so we can get the details about it when the user asks later
                    var song = {
                        videoUrl: videoUrl,
                        streamUrl: ytdl(videoUrl),
                        name: details.title,
                        author: details.author,
                        duration: time,
                    };

                    addSongToQueue(song);

                    // If there's currently anything playing, we'll add it to the queue instead of trying to play it
                    if(client.voiceConnections.size > 0)
                    {
                        // Notifies the user that we're adding it to the queue instead of playing it
                        message.reply(`Added ${details.title} by ${details.author} - ${time} to queue\n${videoUrl}`);
                    }
                    else
                    {
                        // This then joins the channel to play the stream
                        userChannel.join().then(connection => {
                            // Gets the stream and immediately dispatches it
                            const stream = ytdl(videoUrl);
                            const dispatcher = connection.playStream(stream);

                            dispatcher.on("start", () => {
                                // On the start of the dispatcher, THEN we send the message
                                message.reply(`Now playing ${details.title} by ${details.author} - ${time}\n${videoUrl}`);
                            });
            
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
                    }
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