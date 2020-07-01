const Discord = require("discord.js");
const fs = require("fs");
const config = require("../config/config.json"); // You'll need to change the example config into an actual one if you fork or clone the repo
const log4js = require('log4js');
const client = new Discord.Client();
var commands = new Map();

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
		catch (error)
		{
			logger.error(`Failed to load ${file}:\n${error}`);
		}
	});

// The utils won't be loaded like that because there's no good way to identify them, they also won't be as many
const reddit = require("./utils/reddit.js");
const saleNotifier = require("./utils/sale-notifier.js");
const messageCleanup = require('./utils/command-channel-clearer.js')

// Processes sent message
client.on("message", message => {
	// Exits the function is the message is from a bot, this avoids infinite loops
	if(message.author.bot) return;

	// Sees if the sent message starts with the command prefix, and if it's in a channel called 'bot-commands'
	if(message.content.startsWith(config.prefix) && message.channel.name == 'bot-commands')
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

	// Checks for subreddit message (won't link the subreddit if there's already a link)
	if(message.content.toLowerCase().includes("r/") && !message.content.toLowerCase().includes("https://"))
	{
		// Try catch because it will crash the bot if it fails
		try
		{
			reddit(message, logger);
		}
		catch(error)
		{
			logger.fatal(`Failed to link subreddit from message ${message.content}:\n${error}`);
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

		var annoucementChannels = client.channels.cache.filter(channel => channel.name == "announcements");
		var commandsChannels = client.channels.cache.filter(channel => channel.name == "bot-commands");

		annoucementChannels.forEach(channel => {
			saleNotifier(channel, logger);
		});

		commandsChannels.forEach(channel => {
			messageCleanup(channel, logger);
		});

	}).catch(error => {
		logger.fatal(`Failed to login:\n${error}`);
	});
