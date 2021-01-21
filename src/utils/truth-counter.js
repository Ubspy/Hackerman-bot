/**
 * @file truth-counter.js
 * @author Ubspy, josiezxh
 * @desc
  Whenever '+1' is detected as a message, it will check if it is a reply, and add to the truth counter channel.
  If it isn't, then won't add to counter. If the '+1' doesn't work, check the
  logger.
 *
 * @param {discord.js <Client>}, Client [Discord client object to work with]
 {@link} https://discord.js.org/#/docs/main/stable/class/Client
 * @param {log4js <Logger>}, Logger [The logger object that will write important data to the log files]
 {@link} https://log4js-node.github.io/log4js-node/
**/

const fs = require('fs');
const config = require('../../config/config.json'); // Goes 2 folders back to get config file.
const truthCounter = require('../../config/truthCounter.json');

exports.name = "truth-counter"

// Returns a function with parameters client and logger.
exports.start = (client, logger) => {
    // Fetches the truth counter's quote channel id, and then checks messages
    client.channels.fetch(config.truthCounterChannelID)
        .then(truthCounterChannel => {
            client.on('message', message => {
                if(message.content.includes('+1'))
                {   // Initializes variable that is the id of the message being replied to.
                    var origMessageID = message.reference.messageID;
        
                    // Fetches the string message using the id, adds count to counter, sends out quote and count into the truth counter channel, rewrites count in the json.
                    message.channel.messages.fetch(origMessageID)
                        .then(fetchedMessage => {
                            truthCounter.currentCount++; // Only changes local object.
                            truthCounterChannel.send(`> ${fetchedMessage.content} \n<@${fetchedMessage.author.id}> \nTruth Counter: ${truthCounter.currentCount}`);
                            fs.writeFileSync(`${__dirname}/../../config/truthCounter.json`, JSON.stringify(truthCounter)); // Rewrites count in json.
                        }).catch(error => {   
                            message.channel.send('Could not fetch message you replied to');
                            logger.error(`Could not fetch message you replied to \n${error}`);
                        });
                }
            });
        }).catch(error => {
            logger.error(`Failed to get truth counter channel \n${error}`);
        });
}