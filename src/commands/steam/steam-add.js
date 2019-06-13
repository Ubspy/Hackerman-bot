const fs = require('fs');
const {google} = require('googleapis');
const search = google.customsearch('v1');
const config = require('../../../config/config.json'); // Goes 3 folders back to get config file
const wishlist = require('./wishlist.json');

exports.name = "add";
exports.desc = "Add a steam game to the wishlist of games";
exports.args = ["game name"];

// This has to be an 
exports.run = async (message, args, logger) => {
    // Since this only takes one argument, and the name of some games have spaces, we're gonna join all the elements together from the args array
    var gameName = args.join(' ');

    // cx: custom engine key
    // q: search query
    // auth: api key
    const options = {
        cx: config.googleSearchEngineID,
        q: `${gameName} -Franchise`, // This bit removes the franchise pages from steam, because if you search like "fallout" it gives you the fallout franchise page
        auth: config.googleToken
    };

    // This does the actual search results
    const res = await search.cse.list(options).catch(error => {
        logger.error(`Failed google custom search:\n${error}`);
    });

    // Gets the link from the google search results
    var link = res.data.items[0].link;

    // Gets the name from the result title
    var gameName = res.data.items[0].title;

    // Gets the steam id by splitting it with / and takes the last element of the steam url, which is the id
    // The epic thing is every single steam url is different so you have do some oddball shit just to get the ID
    // The app ID is (hopefully) always after 'app/' so we look for that and get the ID afterwards
    var gameID = link.split('/')[link.split('/').indexOf('app') + 1];

    // Checks to see if the wishlist already contains the game
    if(!wishlist.games.some(game => game.id === gameID))
    {
        // Notifies the user that the game was added
        message.reply(`Added ${gameName} to wishlish\n${link}`);
        
        // Adds game to wishlist object, then writes it to the file
        wishlist.games.push({"name" : gameName, "id" : gameID, "onSale" : false});
        fs.writeFileSync(`${__dirname}/wishlist.json`, JSON.stringify(wishlist));

        logger.info(`Removed game ${gameName} with id ${gameId} from wishlist`);

    }
    else
    {
        message.reply(`${gameName} is already on the wishlist\n${link}`);
    }
};