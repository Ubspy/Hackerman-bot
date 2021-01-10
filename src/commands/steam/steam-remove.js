/**
 * @file steam-remove.js
 * @author Ubspy
 * @desc
   Will remove a steam game to the wishlist.json file
 *
 * @param {discord.js <Message>}, message [Message object to work with]
 {@link} https://discord.js.org/#/docs/main/stable/class/Message
 * @param args, arguments to the command provided by the user
 * @param {log4js <Logger>}, logger [The logger object that will write important data to the log files]
 {@link} https://log4js-node.github.io/log4js-node/
**/

const fs = require('fs');
const {google} = require('googleapis');
const search = google.customsearch('v1');
const config = require('../../../config/config.json'); // Goes 3 folders back to get config file
const wishlist = require('../../../config/wishlist.json');

exports.name = "remove";
exports.desc = "Removes a steam game to the wishlist of games";
exports.args = ["game name"];

// This has to be an 
exports.run = async (message, args, logger) => {
	// Since this only takes one argument, and the name of some games have spaces, we're gonna join all the elements together from the args array
	var gameToSearch = args.join(' ');

	// cx: custom engine key
	// q: search query
	// auth: api key
	const options = {
		cx: config.googleSearchEngineIDs.steam,
		q: `${gameToSearch}`,
		auth: config.googleToken
	};

	// This does the actual search results
	const res = await search.cse.list(options)
		.catch(error => {
			logger.error(`Failed google custom search:\n${error}`);
		});

	// Gets the link from the google search results
	var link = res.data.items[0].link;

	// Gets the steam id by splitting it with / and takes the last element of the steam url, which is the id
	// The epic thing is every single steam url is different so you have do some oddball shit just to get the ID
	// The app ID is (hopefully) always after 'app/' so we look for that and get the ID afterwards
	var gameID = link.split('/')[link.split('/').indexOf('app') + 1];

	// Checks to see if the wishlist already contains the game
	if(wishlist.games.some(game => game.id === gameID))
	{
		// Gets the name from the json file
		var gameName = wishlist.games.find(game => game.id == gameID).name;

		// Notifies the user that the game was added
		message.reply(`Removed ${gameName} to wishlish\n${link}`);
		
		// Removes game from wishlist object, then writes it to the file
		wishlist.games.pop({"name" : gameName, "id" : gameID});
		fs.writeFileSync(`${__dirname}/../../../config/wishlist.json`, JSON.stringify(wishlist));

		logger.info(`Removed game ${gameName} with id ${gameID} to wishlist`);
	}
	else
	{
		message.reply(`Could not find ${gameToSearch} on the wishlist\n${link}`);
	}
}