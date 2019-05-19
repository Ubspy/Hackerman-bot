const Discord = require("discord.js");
const fs = require("fs");
const config = require("../config/config.json");
const client = new Discord.Client();
var commands = new Map();

// readdirSync will return an array of each file in the commands folder
// after that, they're filtered to only include files ending with .js
fs.readdirSync(__dirname + "/commands")
	.filter(file => file.endsWith(".js"))
	.forEach(file => {
		try {
			let command = require(`./commands/${file}`);
			console.log("Loaded command: " + file);
			commands.set(command.name, command);
		} catch (err) {
			console.log(`Failed to load ${file}`, err);
		}
	});

// The utils won't be loaded like that because there's no good way to identify them, they also won't be as many
const reddit = require("./utils/reddit.js");

// Processes sent message
client.on("message", message => {
	// Exits the function is the message is from a bot, this avoids infinite loops
	if (message.author.bot) return;

	// Sees if the sent message starts with the command prefix
	if (message.content.startsWith(config.prefix)) {
		// Gets arguments from message by space seperation
		let args = message.content
			.slice(config.prefix.length)
			.split(" ");

		// Removes the first element from the args array and sets it to this variable, also sets it to lowercase
		let commandName = args.shift().toLowerCase();

		// If our command list has a command with the typed name, it tries it
		if (commands.has(commandName)) {
			// Gets the actual command
			var command = commands.get(commandName);

			// Tries to run the command
			try {
				command.run(message, args);
			} catch(err) {
				console.log(`Failed to load "${commandName}"`, err);
			}
		}
	}

	// Checks for subreddit message
	if (message.content.includes("r/")) {
		reddit(message);
	}
});

client.login(config.token)
	.then(() => {
		// Outputs debug for when the bot has connected
		console.log("Connected as " + client.user.username);
	})
	.catch(console.log);
