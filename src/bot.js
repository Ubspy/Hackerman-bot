/**
 * @file bot.js
 * @author Ubspy
 * @desc
   The main file :)
**/

const Discord = require("discord.js");
const fs = require("fs");
const config = require("../config/config.json"); // You'll need to change the example config into an actual one if you fork or clone the repo
const log4js = require('log4js');
const client = new Discord.Client();
var commands = new Map();
var utils = new Map();

// Sets logging output file as well as in console
// TODO: Make it runnable without console output (so on further look, this is really hard to do, this is a low priority TODO)
log4js.configure({
    appenders: {
		fileLogging: {
			type: 'file',
			filename: './logs/hackerman.log',
			maxLogSize: 2048
		},
		debugLogging: {
			type: 'console'
		}
	},
    categories: {
		default: {
			appenders: ['fileLogging', 'debugLogging'],
			level: 'all'
		}
	}
});

const logger = log4js.getLogger();

// First thing is we will check to make sure there's a config file and a wishlist file
if(!fs.existsSync(`${__dirname}/../config/config.json`))
{
	logger.fatal(`There is no config file, make sure to place a config file named "config.json" in the config folder with the same properties as the example, just with actual api keys`);
	process.exit(0); // Exits the program because without the config there's nothing
}

// Once we know we have the config file we should check for the wishlist.json file
// It doesn't come with the repo so if it doesn't exist in the file system on boot we will make it
if(!fs.existsSync(`${__dirname}/../config/wishlist.json`))
{
	// This is blank json object that just holds the games in an array
	var wishlistJson = {
		games: []
	}

	logger.info(`Creating wishlist.json file`);
	fs.writeFileSync(`${__dirname}/../config/wishlist.json`, JSON.stringify(wishlistJson));
}

// We should also check for the truth-counter.json file
// It doesn't come with the repo so if it doesn't exist in the file system on boot we will make it
if(!fs.existsSync(`${__dirname}/../config/truthCounter.json`))
{
	// This is blank json object that just holds the counter
	var truthCounterJson = {
		currentCount: 0
	}

	logger.info(`Creating truth-counter.json file`);
	fs.writeFileSync(`${__dirname}/../config/truthCounter.json`, JSON.stringify(truthCounterJson));
}

// readdirSync will return an array of each file in the commands folder
// after that, they're filtered to only include files ending with .js
fs.readdirSync(__dirname + "/commands")
	.filter(file => file.endsWith(".js"))
	.forEach(file => {
		try
		{
			// Loads the file from the dir
			var command = require(`${__dirname}/commands/${file}`);
			logger.info("Loaded command: " + file);

			// Adds it to the hashmap with the key of the command name, and the value of the command
			commands.set(command.name, command);
		}
		catch(error)
		{
			logger.error(`Failed to load ${file}:\n${error}`);
		}
	});


fs.readdirSync(__dirname + "/utils")
	.filter(file => file.endsWith(".js"))
	.forEach(file => {
		try
		{
			// Loads file into a variable
			var util = require(`${__dirname}/utils/${file}`);
			logger.info(`Loaded util: ${file}`);

			// Add it to the hashmap like we did for the commands
			utils.set(util.name, util);
		}
		catch(error)
		{
			logger.error(`Failed to load ${file}:\n${error}`);
		}
	});

// Processes sent message
client.on("message", message => {
	// Exits the function is the message is from a bot, this avoids infinite loops
	if(message.author.bot) return;

	// Sees if the sent message starts with the command prefix, and if it's in a channel called 'bot-commands'
	if(message.content.startsWith(config.prefix) && message.channel.id == config.botCommandsChannelID)
	{
		// Gets arguments from message by space seperation
		var args = message.content
			.slice(config.prefix.length)
			.split(" ");

		// Removes the first element from the args array and sets it to this variable, also sets it to lowercase
		var commandName = args.shift().toLowerCase();

		// If our command list has a command with the typed name, it tries it
		if(commands.has(commandName))
		{
			// Gets the actual command
			var command = commands.get(commandName);

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
		else // If the command isn't on the list
		{
			message.reply(`${commandName} isn't a valid command, try \`!help\``);
		}
	}

	// Checks if message is "good bot"
	if(message.content.toLocaleLowerCase().includes("good bot"))
	{
		message.channel.send("<3");
	}
});

client.login(config.discordToken)
	.then(() => {
		// Outputs debug for when the bot has connected
		logger.info("Connected as " + client.user.username);

		// Run every util giving it the logger, and the logged in client
		utils.forEach(util => {
			util.start(client, logger);
			logger.info(`Started util ${util.name}`);
		});

	}).catch(error => {
		logger.fatal(`Failed to login:\n${error}`);
	});

// Method for getting the discord client
exports.getClient = () => {
	return client;
}