const fs = require('fs');

exports.name = "help";
exports.desc = "Lists avalible steam commands with their usage";
exports.args = [];

exports.run = (message, args, logger) => {
    var steamHelpString = "```\n";

     // Loads each command file from a file
     fs.readdirSync(__dirname)
     .filter(file => file.endsWith(".js"))
     .forEach(file => {
         logger.info(`Loading ${file} for help...`);
         try
         {
             // Loads command from file
             var command = require(`${__dirname}/${file}`);

             // Adds command name
             steamHelpString += `${command.name}`

             // Adds arguments if there are any
             if(command.args.length > 0)
             {
                 command.args.forEach(arg => {
                    steamHelpString += ` <${arg}>`;
                 });
             }

             // Finishes off command with its description
             steamHelpString += `: ${command.desc}\n`;
         }
         catch(error)
         {
             logger.fatal(`Failed to execute help command:\n${error}`);
         }
     });

    // Ends discord formatting
    steamHelpString += "```";

    // Send the actual message with error catch
    message.channel.send(steamHelpString).then(() => {
        logger.info("Steam help sent!");
    }).catch(error => {
        logger.error(`Failed to send steam help:\n${error}`);
    });
};