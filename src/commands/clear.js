// This will clear all the messages in the bot channel
exports.name = "clear";
exports.desc = "Clears the bot-commands channel for convenience";
exports.args = [];

exports.run = (message, args, logger) => {
    //Gets all messages in the bot-commands channel
    message.channel.fetchMessages({limit:100}).then(messages => {
        // Calls recursive function
        bulkDeleteMessages(messages, messages.first().channel, logger);
        logger.info("Clearing bot-commands channel");
    }).catch((error) => {
        // If something goes wrong, log it
        logger.fatal(`Failed to clear chat:\n${error}`);
    });
};

bulkDeleteMessages = (messages, channel, logger) => {

    // Bulk deletes the messages we passed in
    channel.bulkDelete(messages).then(() => {
        //Gets all messages in the bot-commands channel
        channel.fetchMessages({limit:100}).then(messages => {
            // If there are messages left, keep deleting
            if(messages.size > 0)
            {
                // Recursively calls the function to delete the remaining messages
                bulkDeleteMessages(messages, channel, logger);
            }
            else
            {
                //Sends a message saying that it's done clearing
                channel.send("Chat log has been cleared!");
            }
        }).catch((error) => {
            // If something goes wrong, log it
            logger.error(`Failed to roll dice:\n${error}`);
        });
    });
}