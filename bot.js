const fs = require('fs')
const log4js = require('log4js');


// Starts logger
const logger = log4js.getLogger();

// Sets logging output file as well as in console
// TODO: Make it runnable without console output (so on further look, this is really hard to do, this is a low priority TODO)
log4js.configure({
    appenders: { fileLogging: { type: 'file', filename: './log/hackerman.log' }, debugLogging: { type: 'console' } },
    categories: { default: { appenders: ['fileLogging', 'debugLogging'], level: 'all' } }
});

const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection(); // New collection to eventually hold all our commands

// readdirSync will return an array of each file in the commands folder
// after that, they're filtered to only include files ending with .js
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')).forEach(file => {
    // Initialize the commands, goes through all the command files and adds each one to our commands collection
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
});

// The utils won't be loaded like that because there's no good way to identify them, they also won't be as many
const reddit = require('./utils/reddit.js');

// Bot config file
const config = require('./config.json');

// Outputs debug for when the bot has connected
client.on('ready', () => {
    logger.debug('Connected as ' + client.user.tag);
});

// Processes sent message
client.on('message', message => {
    // Exits the function is the message is from a bot, this avoids infinite loops
    if(message.author.bot) return;

    // Sees if the sent message starts with the command prefix
    if(message.content.startsWith(config.prefix))
    {
        // Gets arguments from message by space seperation
        var args = message.content.slice(config.prefix.length).split(' ');

        // Removes the first element from the args array and sets it to this variable, also sets it to lowercase
        var commandName = args.shift().toLowerCase();

        // If our command list has a command with the typed name, it tries it
        if(client.commands.has(commandName))
        {
            // Gets the actual command
            var command = client.commands.get(commandName);

            // Tries to run the command
            try
            {
                command.run(message, args);
            }
            catch(error)
            {
                logger.error(error);
                message.reply("There was a big oof, check the logs");
            }
        }
    }

    // Checks for subreddit message
    if(message.content.includes('r/'))
    {
        // Links the subreddit
        reddit(message, logger);
    }
});

client.login(config.token);