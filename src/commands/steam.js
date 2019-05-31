// This will handle the commands for our steam subsystem, current functionality is a steam wishlist that will @ everyone if there's a wanted game on sale
const fs = require('fs');
var steamCommands = new Map();


exports.name = "steam";
exports.desc = "The steam subsystem of the bot, for more info type '!steam help'";
exports.args = ['action'];

exports.run = (message, args, logger) => {
    // Only loads all the steam commands if it needs to
    if(steamCommands.size == 0)
    {
        // readdirSync will return an array of each file in the commands folder
        // after that, they're filtered to only include files ending with .js
        fs.readdirSync(__dirname + "/steam")
        .filter(file => file.endsWith(".js"))
        .forEach(file => {
            try
            {
                // Loads the file from the dir
                var command = require(`${__dirname}/steam/${file}`);
                logger.info("Loaded command: " + file);
                
                // Adds it to the hashmap with the key of the command name, and the value of the command
                steamCommands.set(command.name, command);
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
        if(steamCommands.has(commandName))
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
        else
        {
            // If the subcommand given doesn't exist
            message.reply(`${commandName} is not a valid steam subcommand`);
        }
    }
    else // If no argument is provided
    {
        message.reply("You need to specify a subcommand");
    }
};