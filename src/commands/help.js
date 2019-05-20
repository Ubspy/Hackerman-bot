//TODO: Javadoc comments
exports.name = "help";
exports.desc = "Lists avalible commands with their usage";
exports.args = [];

exports.run = (message, commands, logger) => {
    // Starts out with this for the discord formatting
    var helpString = "```\n";

    commands.forEach(command =>
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
    });

    // Ends discord formatting
    helpString += "```";

    // Send the actual message with error catch
    message.channel.send(helpString).then(() => {
        logger.info("Help sent!");
    }).catch(error => {
        logger.error(`Failed to send help:\n${error}`);
    });
};