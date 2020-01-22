const fs = require('fs');
var schedule = require('node-schedule');
const config = require('../../config/config.json'); // Goes 2 folders back to get config file
const wishlist = require('../../config/wishlist.json');

const request = require('request');

module.exports = (announcementChannel, logger) => {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    // Job that'll run everyday at 6 pm on machine's localtime
    var job = schedule.scheduleJob("* 18 * * *", () => {
        wishlist.games.forEach(game => {
            request({
                url: `https://store.steampowered.com/api/appdetails?appids=${game.id}`,
                json: true
            },
            (error, response, body) => {
                var data = body[game.id].data;

                if(error)
                {
                    // This happens if the page couldn't be reached
                    logger.error(`Something went horribly wrong when looking for info on ${game.name} with id ${game.id}: ` + error);
                    message.reply("Something went horribly wrong, please check the log files");
                }
                else if(data.price_overview.discount_percent > 0 && !game.onSale) // Checks if game is on sale
                {
                    // Announces it in the announcement channel
                    announcementChannel.send(`${game.name} is ${data.price_overview.discount_percent}% off!. It's on sale from ${formatter.format(data.price_overview.initial/100)} to ${formatter.format(data.price_overview.final/100)}\n${game.link}`);

                        // Changes game's sale state to true and writes to the file
                        game.onSale = true;
                        fs.writeFileSync(`${__dirname}/../../config/wishlist.json`, JSON.stringify(wishlist));

                        logger.info(`Notified users that ${game.name} is on sale`);
                    }
                    else if(details.price_overview.discount_percent == 0 && game.onSale)
                    {
                        // Changes game's sale state to false and writes to the file
                        game.onSale = false;
                        fs.writeFileSync(`${__dirname}/../../config/wishlist.json`, JSON.stringify(wishlist));
 
                        logger.info(`${game.name} is no longer on sale`);
                    }
                }
            );
        });
    });
};
