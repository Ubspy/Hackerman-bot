const Discord = require("discord.js");
const fs = require("fs");
const config = require("../config/config.json"); // You'll need to change the example config into an actual one if you fork or clone the repo
const log4js = require('log4js');
const logger = log4js.getLogger();
const client = new Discord.Client();
var commands = new Map();

// Sets logging output file as well as in console
// TODO: Make it runnable without console output (so on further look, this is really hard to do, this is a low priority TODO)
log4js.configure({
    appenders: {
		fileLogging: {
			type: 'file',
			filename: './log/hackerman.log',
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

// readdirSync will return an array of each file in the commands folder
// after that, they're filtered to only include files ending with .js
fs.readdirSync(__dirname + "/commands")
	.filter(file => file.endsWith(".js"))
	.forEach(file => {
		try
		{
			var command = require(`./commands/${file}`);
			logger.info("Loaded command: " + file);
			commands.set(command.name, command);
		}
		catch (error)
		{
			logger.error(`Failed to load ${file}:\n${error}`);
		}
	});

// The utils won't be loaded like that because there's no good way to identify them, they also won't be as many
const reddit = require("./utils/reddit.js");

// Processes sent message
client.on("message", message => {
	// Exits the function is the message is from a bot, this avoids infinite loops
	if (message.author.bot) return;

	// Sees if the sent message starts with the command prefix, and if it's in a channel called 'bot-commands'
	if (message.content.startsWith(config.prefix) && message.channel.name == 'bot-commands')
	{
		// Gets arguments from message by space seperation
		var args = message.content
			.slice(config.prefix.length)
			.split(" ");

		// Removes the first element from the args array and sets it to this variable, also sets it to lowercase
		var commandName = args.shift().toLowerCase();

		// So yes this defeats the purpose of the dynamic commands, but the help command needs different arguments so I have to add it statically
		if(commandName == "help")
		{
			// Runs the help command
			commands.get("help").run(message, commands, logger);
		}
		else if (commands.has(commandName)) // If our command list has a command with the typed name, it tries it
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
				logger.error(`Failed to run ${commandName}:\n${error}`);
                message.reply("There was a big oof in running that command, check the logs");
			}
		}
	}

	// Checks for subreddit message 
	if (message.content.toLowerCase().includes("r/"))
	{
		reddit(message, logger);
	}
});

client.login(config.token)
	.then(() => {
		// Outputs debug for when the bot has connected
		logger.info("Connected as " + client.user.username);
	}).catch(error => {
		logger.fatal(`Failed to login:\n${error}`);
	});
