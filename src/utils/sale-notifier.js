const fs = require('fs');
var schedule = require('node-schedule');
const config = require('../../config/config.json'); // Goes 2 folders back to get config file
const wishlist = require('../../config/wishlist.json');

const SteamAPI = require('steamapi');
const steam = new SteamAPI(config.steamToken);

module.exports = (announcementChannel, logger) => {
    // Job that'll run everyday at 6 pm on machine's localtime
    var job = schedule.scheduleJob("* 18 * * *", () => {
        wishlist.games.forEach(game => {
            steam.getGameDetails(game.id).then(details => {                
                // Checks if game is on sale
                if(details.price_overview.discount_percent > 0 && !game.onSale)
                {
                    // Announces it in the announcement channel
                    announcementChannel.send(`${game.name} is ${details.price_overview.discount_percent}% off!. It's on sale from ${details.price_overview.initial} to ${details.price_overview.final}\n${game.link}`);

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
            });
        });
    });
};