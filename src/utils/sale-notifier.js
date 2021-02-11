/**
 * @file sale-notifier.js
 * @author Ubspy
 * @desc
   Checks every hour for steam sales on every game stored in the local wishlist file,
   if there's a sale it'll send it into the announcement channel
 *
 * @param {discord.js <Client>}, Client [Discord client object to work with]
 {@link} https://discord.js.org/#/docs/main/stable/class/Client
 * @param {log4js <Logger>}, Logger [The logger object that will write important data to the log files]
 {@link} https://log4js-node.github.io/log4js-node/
**/

const fs = require('fs');
const request = require('request');
const schedule = require('node-schedule');
const config = require('../../config/config.json'); // Goes 2 folders back to get config file
const wishlist = require('../../config/wishlist.json');

exports.name = "sale-notifier";

exports.start = (client, logger) => {

    // Here we fetch the announcement channel
    client.channels.fetch(config.announcementChannelID)
        .then(announcementChannel => {			
            // Once we get it, we tell it to run the sale notifier utility
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });
        
            // Job that'll run every hour
            var job = schedule.scheduleJob("0 */1 * * *", () => {
        
                logger.info(`Checking for updated sale stats...`);

                wishlist.games.forEach(game => {
                    request({
                        url: `https://store.steampowered.com/api/appdetails?appids=${game.id}`,
                        json: true
                    },
                    (error, response, body) => {
                        var data = body[game.id].data;

                        // Initial blank announcement message
                        var announcementMessage = "";
        
                        // First we're going to check and make sure these price variables exist, if not we'll send a message notifying the server
                        // This is first because if this returns true the other else ifs shouldn't even be evaluated
                        if(data.price_overview === undefined)
                        {
                            announcementChannel.send(`Could not get the price data for the game ${game.name}, with id ${game.id} and url \n${game.link} \nPlease make sure this is a proper game!`).catch(error => {
                                logger.error(error);
                            });
                        }
                        else if(error || !data)
                        {
                            // This happens if the page couldn't be reached
                            logger.error(`Something went horribly wrong when looking for info on ${game.name} with id ${game.id}: ` + error);
                            message.reply("Something went horribly wrong, please check the log files");
                        }
                        else if(data.price_overview.discount_percent > 0 && !game.onSale)
                        {
                            // Adds game to announcement message
                            announcementMessage += (`${game.name} is ${data.price_overview.discount_percent}% off!. It's on sale from ${formatter.format(data.price_overview.initial / 100)} to ${formatter.format(data.price_overview.final / 100)} \n${game.link}\n`);
        
                            // Changes game's sale state to true and writes to the file
                            game.onSale = true;
                            fs.writeFileSync(`${__dirname}/../../config/wishlist.json`, JSON.stringify(wishlist));
        
                            logger.info(`Updated games file, ${game.name} is on sale`);
                        }
                        else if(data.price_overview.discount_percent == 0 && game.onSale)
                        {
                            // Changes game's sale state to false and writes to the file
                            game.onSale = false;
                            fs.writeFileSync(`${__dirname}/../../config/wishlist.json`, JSON.stringify(wishlist));
        
                            logger.info(`Updated the games file, ${game.name} is no longer on sale`);
                        }
        
                        // If there is a message to announce, send it
                        if(announcementMessage != "")
                        {
                            // As long as there's an announcement message, we send it
                            announcementChannel.send(announcementMessage)
                                .then(message => {
                                    // Here we delete the embeds on the message, and add a log message
                                    message.suppressEmbeds();
                                }).catch(error => {
                                    // Error catching
                                    logger.error(error);
                                });  
                        }
                        }
                    });
                });           
            }); 
        }).catch(error => {
            // If we fail, then we log a fatal error
            logger.fatal(`Failed to fetch announcement channel with id ${config.announcementChannelID}\n${error}`);
        });
}
