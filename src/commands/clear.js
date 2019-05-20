//const sleep = require('sleep');

// This will clear all the messages in the bot channel
exports.name = "clear";
exports.desc = "Clears the bot-commands channel for convenience"

exports.run = (message, args, logger) => {
    //Gets all messages in the bot-commands channel
    message.channel.fetchMessages().then(messages =>
    {
        //Bulk deletes all the messages
        message.channel.bulkDelete(messages);
        logger.info("Command channel has been cleared")
    }).catch(error => {
        // If something goes wrong, log it
        logger.error(`Failed to clear chat:\n${error}`);
    });

    //Sends a message
    message.channel.send("Chat log has been cleared!").then(thisMessage =>
    {
        //After the message it sent, it waits three seconds and deletes itself
        setTimeout(() =>{
            thisMessage.delete();
        }, 3000);
    });
};