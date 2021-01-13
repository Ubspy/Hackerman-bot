/**
 * @file steam-list.js
 * @author Ubspy
 * @desc
   Lists games currently on the wishlist in alphabetical order
 *
 * @param {discord.js <Message>}, message [Message object to work with]
 {@link} https://discord.js.org/#/docs/main/stable/class/Message
 * @param args, arguments to the command provided by the user
 * @param {log4js <Logger>}, logger [The logger object that will write important data to the log files]
 {@link} https://log4js-node.github.io/log4js-node/
**/

const wishlist = require('../../../config/wishlist.json');

exports.name = "list";
exports.desc = "Lists all games currently in the wishlist";
exports.args = [];

exports.run = (message, args, logger) => {
	var gamesString = '```\n';
	var gamesCount = 0; // Keeps track of games on wishlist

	// Sorts wishlist alphabetically
	wishlist.games.sort((a, b) => {
		if(a.name < b.name) { return -1; }
		else if(a.name > b.name) { return 1; }
		else { return 0; }
	});

	// Goes through and adds all the games
	wishlist.games.forEach(game => {
		gamesString += `${game.name}: ${game.onSale}\n`;
		gamesCount++;
	});

	gamesString += "```";

	// Will say there are no games on the wishlist if there aren't any
	if(gamesCount == 0)
	{
		gamesString = 'You have no games on your wishlist';
	}

	// Sends string with games
	message.channel.send(gamesString)
		.then(() => {
			logger.info("Listed steam games");
		}).catch(error => {
			logger.error(`Failed to send steam game list\n${error}`);
		});
}