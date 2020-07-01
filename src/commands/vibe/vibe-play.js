const fs = require('fs');
const {google} = require('googleapis');
const search = google.customsearch('v1');
const ytdl = require('ytdl-core');

const config = require('../../../config/config.json');
const client = require('../../bot.js').getClient();
const vibe = require('../vibe.js');

exports.name = "play";
exports.desc = "Plays an a video from youtube, also resumes the player when paused";
exports.args = ['file'];

exports.run = (message, args, logger) => {
    if(args.length < 1)
    {
        // We're going to check and see if the bot is connected to any voice channels
        if(client.voice.connections.first())
        {
            // If it is then we'll look for a dispatcher to resume
            const dispatcher = client.voice.connections.first().dispatcher;

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
                client.voice.connections.first().disconnect();
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
        userChannel = message.member.voice.channel;

        if(userChannel)
        {
            fetchVideoID(options, 0, message).then(videoID => {
               // Gets the video info once we have a valid ID
                ytdl.getBasicInfo(videoID).then(videoInfo => {
                    // Here is a variable holding all the video deatils
                    var details = videoInfo.player_response.videoDetails;

                    // Get the number of hours, minutes and remaining seconds in a video
                    var hours = Math.floor(details.lengthSeconds / 3600);
                    var minutes = Math.floor((details.lengthSeconds - (hours * 3600)) / 60);
                    var seconds = details.lengthSeconds - (hours * 3600) - (minutes * 60);

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
                    var time = `${minutes}:${seconds}`;

                    // Add hours onto the str only if there's at least 1 hour of video
                    time = (hours > 0) ? `${hours}:${time}` : time;

                    // Here we get the video url via basic youtube pattern, and the get the playable steam
                    var videoUrl = `https://youtube.com/watch?v=${videoID}`
                    var playableStream = ytdl(videoUrl);

                    // We're gonna add the song to the queue so we can get the details about it when the user asks later
                    var song = {
                        videoUrl: videoUrl,
                        stream: playableStream,
                        name: details.title,
                        author: details.author,
                        durationStr: time,
                        durationInSeconds: details.lengthSeconds
                    };

                    vibe.addSongToQueue(song, logger);

                    // If there's currently anything playing, we'll add it to the queue instead of trying to play it
                    if(client.voice.connections.size > 0)
                    {
                        // Notifies the user that we're adding it to the queue instead of playing it
                        message.reply(`Added ${details.title} by ${details.author} - ${time} to queue\n${videoUrl}`);
                    }
                    else
                    {
                        // This then joins the channel to play the stream
                        userChannel.join().then(connection => {
                            // Since we already have all the song information, we'll just use the method to play the song
                            playSong(song, connection, message, logger, true);
                        }).catch(error => { // Don't forget the error catching
                            logger.error(`Could not connect to voice channel:\n${error}`)
                        });
                    }
                }); 
            }).catch(error => {
                logger.error(`Failed google custom search:\n${error}`);
                message.reply(`Failed to search for songs :(`);
            });
        }
        else
        {
            // If the user isn't in a voice channel
            message.reply("You need to be in a voice channel >:(");
        }
    }
}

// This will be the function for fetching a video, and we'll return a valid promise if it's a valid one
fetchVideoID = (options, index, message) => {
    return new Promise((resolve, reject) => {
        // This does the actual search results
        search.cse.list(options).then(res => {
            // Gets url from search to play
            var videoUrl = res.data.items[index].formattedUrl;

            // Here we're going to TRY and get the video id, if it fails the video is gonna need to be fixed
            try
            {
                var videoID = ytdl.getURLVideoID(videoUrl);
                resolve(videoID); // If it's a valid ID we'll return it as a successful promise
            }
            catch(error)
            {
                // If it's not valid, we try to fetch the next video id and resolve it
                fetchVideoID(options, index+1, message).then(videoID => {
                    resolve(videoID);
                });
            }
        }).catch(error => {
            reject(error);
        });
    });
};

// Here we will have a recusrive function for playing a song
// We have the default parameter of a new play as false, but if specified otherwise then we'll deal with it accordingly
playSong = (song, connection, message, logger, newPlay = false) => {
    const dispatcher = connection.play(song.stream);

    dispatcher.on("start", () => {
        logger.info(`Started audio from ${song.videoUrl}`);

        // On the start of the dispatcher, THEN we send the message
        // If it's not continuing the queue then we'll use a reply, otherwise we'll just send a normal message
        if(newPlay)
        {
            message.reply(`Now playing "${song.name}" by ${song.author} - ${song.durationStr}\n${song.videoUrl}`);
        }
        else
        {
            message.channel.send(`Now playing "${song.name}" by ${song.author} - ${song.durationStr}\n${song.videoUrl}`);
        }

        // We will also set the bots activity status
        client.user.setActivity(song.name, {type: "PLAYING"}).catch(error => {
            logger.error(`Could not set activity:\n${error}`);
        });
    });

    // When the file is done playing
    dispatcher.on("finish", finish => {
        logger.info(`Finished audio from ${song.videoUrl}`);

        // When the song is done we'll remove it from the queue (it'll be the first song in the queue)
        vibe.removeSongFromQueue(0);

        console.log(vibe.getQueueLength());

        // When we end the current song we wanna see if there's another song to play
        if(vibe.getQueueLength() > 0)
        {
            // If there are songs left in the queue, we gotta play the next one
            var nextSong = vibe.getSongFromQueue(0);

            // Recursively calls the method to play the next song
            playSong(nextSong, connection, message, logger);
        }
        else
        {
            // If there isn't we disconnect because the play queue is now done
            connection.disconnect();

            // We also clear the activity
            client.user.setActivity("");
        }
    });

    // If the dispatcher has an error
    dispatcher.on("error", error => {
        connection.disconnect();
        logger.error(`Error while playing audio from ${song.videoUrl}:\n${error}`);

        // We also clear the activity
        client.user.setActivity("");
    });
};