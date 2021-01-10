const fs = require('fs');
const config = require('../../config/config.json'); // Goes 2 folders back to get config file.
const truthCounter = require('../../config/truthCounter.json');

module.exports = (client, logger) => {

    client.channels.fetch(config['truth-counter-channel-id'])
        .then(truthCounterChannel => {

            client.on('message', message => {

                if(message.content.includes('+1'))
                {
                    var origMessageID = message.reference.messageID;
        
                    message.channel.messages.fetch(origMessageID)
                        .then(fetchedMessage => {

                            truthCounter.currentCount++;
                            truthCounterChannel.send(`> ${fetchedMessage.content} \n<@${fetchedMessage.author.id}> \nTruth Counter: ${truthCounter.currentCount}`);
                            fs.writeFileSync(`${__dirname}/../../config/truthCounter.json`, JSON.stringify(truthCounter));

                        }).catch(error => {

                            message.channel.send('Could not fetch message you replied to');
                            logger.error(`Could not fetch message you replied to \n${error}`);
                            
                        });
                }
            });
        })
}