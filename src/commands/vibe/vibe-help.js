const fs = require('fs');

exports.name = "help";
exports.desc = "Lists avalible vibe commands with their usage";
exports.args = [];

exports.run = (message, args, logger) => {
    var vibeHelpString = "```\n";

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
             vibeHelpString += `${command.name}`

             // Adds arguments if there are any
             if(command.args.length > 0)
             {
                 command.args.forEach(arg => {
                    vibeHelpString += ` <${arg}>`;
                 });
             }

             // Finishes off command with its description
             vibeHelpString += `: ${command.desc}\n`;
         }
         catch(error)
         {
             logger.fatal(`Failed to execute help command:\n${error}`);
         }
     });

    // Ends discord formatting
    vibeHelpString += "```";

    // Send the actual message with error catch
    message.channel.send(vibeHelpString).then(() => {
        logger.info("Vibe help sent!");
    }).catch(error => {
        logger.error(`Failed to send vibe help:\n${error}`);
    });
};