const wishlist = require('../../../config/wishlist.json');

exports.name = "get-sales";
exports.desc = "Gets steam games on wishlist that are on sale";
exports.args = [];

exports.run = (message, args, logger) => {
    var gamesString = '```\n';
    var saleCount = 0; // Stores number of games on sale

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
            saleCount++;
        }
    });

    gamesString += "```";

    if(saleCount == 0)
    {
        gamesString = 'There are currently no games on sale :(';
    }

    // Sends string with games
    message.channel.send(gamesString).then(() => {
        logger.info("Listed steam games on sale");
    }).catch(error => {
        logger.error(`Failed to send steam sales game list\n${error}`);
    });
};