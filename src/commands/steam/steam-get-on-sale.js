const wishlist = require('../../../config/wishlist.json');

exports.name = "get-sales";
exports.desc = "Gets steam games on wishlist that are on sale";
exports.args = [];

exports.run = (message, args, logger) => {
    var gamesString = '```\n';

    // Sorts wishlist alphabetically
    wishlist.games.sort((a, b) => {
        if(a.name < b.name) { return -1; }
        else if(a.name > b.name) { return 1; }
        else { return 0; }
    });

    // Goes through and adds all the games
    wishlist.games.forEach(game => {
        if(game.onSale)
        {
            gamesString += `${game.name}\n`;
        }
    });

    gamesString += "```";

    // Sends string with games
    message.channel.send(gamesString).then(() => {
        logger.info("Listed steam games on sale");
    }).catch(error => {
        logger.error(`Failed to send steam sales game list\n${error}`);
    });
};