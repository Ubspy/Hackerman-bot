const fs = require('fs');

exports.name = "play";
exports.desc = "Will play an audio file stored on the server";
exports.args = ['file'];

// Variable to make sure two play commands won't play at once
var isPlaying = false;

exports.run = function(message, args, logger) {
    if(args.length > 1)
    {
        message.reply("There were too many arguments!")
    }
    else if(args.length < 1)
    {
        message.reply("You didn't specify a file to play! Try `!play list` to get a list of files");
    }
    else // If all the requirements are met
    {
        fileName = args[0];

        if(fileName == "list")
        {
            // Here we gotta list files in the audio folder
            messageStr = "Here are the playable files:\n```\n";

            // Read the audio folder and for each mp3 file it'll add that to the list
            fs.readdirSync(`${__dirname}/../../audio/`)
            .filter(file => file.endsWith('.mp3'))
            .forEach(file => {
                console.log(file);
                messageStr += file + '\n';
            });

            messageStr += "```"; // Ends string formatting
            message.channel.send(messageStr).then(() => {
                logger.info('Listed audio filed');
            }).catch(error => {
                logger.error(`Error listing audio files:\n${error}`)
            });
        }
        else if(isPlaying) // If there's currently anything playing
        {
            message.reply("Wait your turn! Audio is already playing, I can only do so much :(");
        }
        else if(fs.existsSync(`${__dirname}/../../audio/${fileName}.mp3`))
        {
            // This gets the voice channel the user is connected to
            userChannel = message.member.voiceChannel;

            if(userChannel)
            {
                // Now we join it
                userChannel.join().then(connection => {
                    // First tell the system we're busy
                    isPlaying = true;

                    // This will happen if it successfully connected
                    // So now we'll try to play the file
                    const dispatcher = connection.playFile(`${__dirname}/../../audio/${fileName}.mp3`);

                    // When the file is done playing
                    dispatcher.on("end", end => {
                        isPlaying = false; // Tell the program we can play another file
                        connection.disconnect(); // Disconnect
                        logger.info(`Played audio file ${fileName}.mp3`);
                    });

                    // If the dispatcher has an error
                    dispatcher.on("error", error => {
                        isPlaying = false;
                        connection.disconnect();
                        logger.error(`Error while playing file ${fileName}:\n${error}`);
                    });

                }).catch(error => { // Don't forget the error catching
                    isPlaying = false; // Set it to false if it fails
                    logger.error(`Could not connect to voice channel:\n${error}`)
                });
            }
            else
            {
                // If the user isn't in a voice channel
                message.reply("You need to be in a voice channel >:(");
            }
        }
        else
        {
            message.reply("File does not exist, try `!play list` to list files to play");
        }
    }
}