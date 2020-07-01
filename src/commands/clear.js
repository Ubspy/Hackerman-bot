// This will clear all the messages in the bot channel
exports.name = "clear";
exports.desc = "Clears the bot-commands channel for convenience";
exports.args = [];

exports.run = (message, args, logger) => {
    logger.info("Clearing bot-commands channel");

    
    // We first get all the messages in the channel from the cache
    messages = message.channel.messages.cache;

    message.channel.bulkDelete(messages, true).then(deleted => {

        // We then check for messages left
        message.channel.messages.fetch({limit: 100}).then(messages => {
            if(messages.size > 0 && deleted.size > 0) // We check for messages left size and deleted messages size incase the ones left can't be bulk deleted
            {
                fetchDelete(messages, message.channel, logger);
            }
            else if(messages.size > 0 && deleted.size == 0)
            {
                // Incase there are any messages left that were older than 2 weeks, we delete them the lame way
                forDelete(message.channel, logger);
            }
            else
            {
                // Send a temp message saying it's done
                message.channel.send(`Chat log has been cleared!`).then(message => {
                    setTimeout(() => {
                        message.delete();
                    }, 3000);
                });
            }
        });
    });
};

fetchDelete = (message, channel, logger) => {
    channel.bulkDelete(messages, true).then(deleted => {
        // Same procedure as before
        channel.messages.fetch({limit: 100}).then(messages => {
            if(messages.size > 0 && deleted.size > 0)
            {
                fetchDelete(messages, channel, logger);
            }
            else if(messages.size > 0 && deleted.size == 0)
            {
                forDelete(messages, channel, logger);
            }
            else
            {
                // Send a temp message saying it's done
                channel.send(`Chat log has been cleared!`).then(message => {
                    setTimeout(() => {
                        message.delete();
                    }, 3000);
                });
            }
        });
    });
}

forDelete = (messages, channel, logger) => {
    for(var i = 0; i < messages.size; i++)
    {
        messages.array[i].delete();
    }

    channel.messages.fetch({limit: 100}).then(messages => {
        if(messages.size > 0 && deleted.size > 0)
        {
            forDelete(messages, channel, logger);
        }
        else
        {
            // Send a temp message saying it's done
            channel.send(`Chat log has been cleared!`).then(message => {
                setTimeout(() => {
                    message.delete();
                }, 3000);
            });
        }
    });
}