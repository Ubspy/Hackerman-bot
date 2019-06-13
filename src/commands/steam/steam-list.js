const wishlist = require('../../../config/wishlist.json');

exports.name = "list";
exports.desc = "Lists all games currently in the wishlist";
exports.args = [];

exports.run = (message, args, logger) => {
    var gamesString = '```\n';

    // Goes through and adds all the games
    wishlist.games.forEach(game => {
        gamesString += `${game.name}: ${game.onSale}\n`;
    });

    gamesString += "```";

    // Sends string with games
    message.channel.send(gamesString).then(() => {
        logger.info("Listed steam games");
    }).catch(error => {
        logger.error(`Failed to send steam game list\n${error}`);
    });
};