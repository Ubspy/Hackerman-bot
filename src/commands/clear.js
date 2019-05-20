// This will clear all the messages in the bot channel
exports.name = "clear";
exports.desc = "Clears the bot-commands channel for convenience"

exports.run = (message, logger) => {
    //Gets all messages in the bot-commands channel
    message.channel.fetchMessages({limit:100}).then(toDelete => {
        // Calls recursive function
        // toDelete.array() gets an array of messages, and we get the channel of the first one to pass on to the method
        deleteMessages(toDelete, message.channel);
        logger.info("Clearing bot-commands channel");
    }).catch((error) => {
        // If something goes wrong, log it
        logger.fatal(`Failed to clear chat:\n${error}`);
    });
};

deleteMessages = (messages, channel) => {
    //Bulk deletes all the messages
    channel.bulkDelete(messages).then(() => {
        //Gets all messages in the bot-commands channel
        channel.fetchMessages({limit:100}).then(toDelete => {
            // If there are messages left, keep deleting
            if(toDelete.array().length > 0)
            {
                // Recursively calls the function to delete the remaining messages
                deleteMessages(toDelete, channel);
            }
            else
            {
                //Sends a message saying that it's done clearing
                channel.send("Chat log has been cleared!").then(thisMessage => {
                    //After the message it sent, it waits three seconds and deletes itself
                    setTimeout(() =>{
                        thisMessage.delete();
                    }, 3000);
                });
            }
        }).catch((error) => {
            // If something goes wrong, log it
            console.log(`Failed to clear chat:\n${error}`);
        });
    });
}