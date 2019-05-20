//TODO: Javadoc comments
exports.name = "help";
exports.desc = "Lists avalible commands with their usage";

exports.run = (message, commands, logger) => {
    // Starts out with this for the discord formatting
    var helpString = "```\n";

    commands.forEach(command =>
    {
        //TODO: Add args
        helpString += `${command.name}: ${command.desc}\n`
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