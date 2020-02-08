// This will handle the commands for our vibe subsystem,
const fs = require('fs');
var vibeCommands = new Map();

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

    // Checks to see if there are any arguments before trying
    if(args.length > 0)
    {
        // Removes the first element from the args array and sets it to this variable, also sets it to lowercase
        var commandName = args.shift().toLowerCase();

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
            // If the subcommand given doesn't exist, we'll just have it play that file
            args.unshift(commandName);
            console.log(args);
            vibeCommands.get("play").run(message, args, logger);
        }
    }
    else // If no argument is provided
    {
        message.reply("You need to specify a subcommand, try \`!vibe help\`");
    }
};