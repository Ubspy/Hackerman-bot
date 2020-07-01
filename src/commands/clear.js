// This will clear all the messages in the bot channel
exports.name = "clear";
exports.desc = "Clears the bot-commands channel for convenience";
exports.args = [];

exports.run = (message, args, logger) => {
    logger.info("Clearing bot-commands channel");

    // We first fetch all the messages in the channel
    message.channel.messages.fetch().then(messages => {
        // We then bulk delete all those messages, this only works for messages less than 2 weeks old
        // The true argument makes it so messages older than 2 weeks stay and it doesn't cause a giant crash
        message.channel.bulkDelete(messages, true).then(messages => {
            // Incase there are any messages left that were older than 2 weeks, we delete them the lame way
            if(messages.array.length > 0)
            {
                // Loop through all of them and delete
                for(var i = 0; i < messages.array.length; i++)
                {
                    messages.array[i].delete();
                }
            }

            // Send a temp message saying it's done
            message.channel.send(`Chat log has been cleared!`).then(message => {
                setTimeout(() => {
                    message.delete();
                }, 3000);
            });
        });
    });
};