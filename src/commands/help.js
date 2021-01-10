/**
 * @file help.js
 * @author Ubspy
 * @desc
   Will list all commands on the bot as well as how to call them
 *
 * @param {discord.js <Message>}, message [Message object to work with]
 {@link} https://discord.js.org/#/docs/main/stable/class/Message
 * @param args, arguments to the command provided by the user
 * @param {log4js <Logger>}, logger [The logger object that will write important data to the log files]
 {@link} https://log4js-node.github.io/log4js-node/
**/

const fs = require('fs');

exports.name = "help";
exports.desc = "Lists avalible commands with their usage";
exports.args = ['command'];

exports.run = (message, args, logger) => {
	// Checking for extra arguments.
	var helpArg = "";

	if(args.length > 1)
	{
		message.reply(`Too many arguments!!`);
		return 0;
	}
	else if(args.length == 1)
	{
		helpArg = args[0];
	}

	// Starts out with this for the discord formatting
	var helpString = "```\n";

	// Loads each command file from a file
	fs.readdirSync(__dirname)
		.filter(file => file.endsWith(".js"))
		.forEach(file => {
			logger.info(`Loading ${file} for help...`);
			try
			{
				// Loads command from file
				var command = require(`${__dirname}/${file}`);

				// If helpArg is empty OR if helpArg is same as command.name.
				if(helpArg == "" || helpArg == command.name) 
				{
					// Adds command name
					helpString += `${command.name}`

					// Adds arguments if there are any
					if(command.args.length > 0)
					{
						command.args.forEach(arg => {
							helpString += ` <${arg}>`;
						});
					}

					// Finishes off command with its description
					helpString += `: ${command.desc}\n`;
				}
			}
			catch(error)
			{
				logger.fatal(`Failed to execute help command:\n${error}`);
			}
		});

	// Ends discord formatting
	helpString += "```";

	// Send the actual message with error catch
	message.channel.send(helpString)
		.then(() => {
			logger.info("Help sent!");
		}).catch(error => {
			logger.error(`Failed to send help:\n${error}`);
		});
}