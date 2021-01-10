/**
 * @file vibe.js
 * @author Ubspy
 * @desc
   Manages the music bot subsystem
 *
 * @param {discord.js <Message>}, message [Message object to work with]
 {@link} https://discord.js.org/#/docs/main/stable/class/Message
 * @param args, arguments to the command provided by the user
 * @param {log4js <Logger>}, logger [The logger object that will write important data to the log files]
 {@link} https://log4js-node.github.io/log4js-node/
**/

const fs = require('fs');
var vibeCommands = new Map();

// This variable will hold the queue
var songQueue = [];

exports.name = "vibe";
exports.desc = "The vibe subsystem of the bot, for more info type '!vibe help'";
exports.args = ['action'];

exports.run = (message, args, logger) => {
	// Only loads commands if the map is already empty
	if(vibeCommands.size == 0)
	{
		// Goes through each .js file and adds it as a command
		fs.readdirSync(__dirname + "/vibe")
			.filter(file => file.endsWith('.js'))
			.forEach(file => {
				try
				{
					// Loads the file from the dir
					var command = require(`${__dirname}/vibe/${file}`);
					logger.info("Loaded command: " + file);
					
					// Adds it to the hashmap with the key of the command name, and the value of the command
					vibeCommands.set(command.name, command);
				}
				catch (error)
				{
					logger.error(`Failed to load ${file}:\n${error}`);
				}
			});
	}

	// Removes the first element from the args array and sets it to this variable, also sets it to lowercase
	var commandName = args.shift().toLowerCase();

	// Checks to see if there are any arguments before trying
	if(commandName)
	{
		// If our command list has a command with the typed name, it tries it
		if(vibeCommands.has(commandName))
		{
			// Gets the actual command
			var command = vibeCommands.get(commandName);

			// Tries to run the command
			try
			{
				command.run(message, args, logger);
			}
			catch(error)
			{
				logger.fatal(`Failed to run ${commandName}:\n${error}`);
				message.reply(`There was a big oof in running ${commandName}, check the logs`);
			}
		}
		else
		{
			// If it doesn't recognize the subcommand it gets mad
			message.reply(`${commandName} is not a valid vibe subcommand! Try running\`!vibe help\``);
		}
	}
	else // If no argument is provided
	{
		message.reply("You need to specify a subcommand, try \`!vibe help\`");
	}
}

/*
	All of these elements will take a song object. Each object should have the following:
	- videoUrl: the video url, so we can show the user what video we're grabbing from
	- stream: the playable string created from ytdl
	- name: the name of the song (should be obvious)
	- author: also pretty obvious
	- duration: like I really hope I don't need to explain this

	All of these variables are gonna be stored in the RAM instead of grabbed just before, that way if they want to list the queue they have all the info right there
*/

exports.addSongToQueue = (song, logger) => {
	// We're going to check for the properties of the object because we don't want any kind of null pointer exception or something when playing a song
	if(!song.hasOwnProperty("videoUrl"))
	{
		logger.error(`Given song does not have a video url!`);
		return 0;
	}
	else if(!song.hasOwnProperty("stream"))
	{
		logger.error(`Given song does not have a stream url!`);
		return 0;
	}
	else if(!song.hasOwnProperty("name"))
	{
		logger.error(`Given song does not have a name!`);
		return 0;
	}
	else if(!song.hasOwnProperty("author"))
	{
		logger.error(`Given song does not have an author!`);
		return 0;
	}
	else if(!song.hasOwnProperty("durationStr"))
	{
		logger.error(`Given song does not have a duration string!`);
		return 0;
	}
	else if(!song.hasOwnProperty("durationInSeconds"))
	{
		logger.error(`Given song does not have a duration in seconds!`);
		return 0;
	}

	// Adds the song to the end of the queue array
	songQueue.push(song);
}

exports.removeSongFromQueue = index => {
	// The splice function removed a specific element from an array
	songQueue.splice(index, 1);
}

exports.getSongFromQueue = index => {
	// Returns the song at the given index
	return songQueue[index];
}

exports.clearQueue = () => {
	// Sets the song queue to be empty
	songQueue = []
}

exports.getQueueLength = () => {
	// I really hope I don't need to comment this part
	return songQueue.length;
}