const fs = require('fs');
const {google} = require('googleapis');
const search = google.customsearch('v1');
const config = require('../../../config/config.json'); // Goes 3 folders back to get config file
const wishlist = require('../../../config/wishlist.json');

const SteamAPI = require('steamapi');
const steam = new SteamAPI(config.steamToken);

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
        cx: config.googleSearchEngineID,
        q: `${gameToSearch} -Franchise -news`, // This bit removes the franchise pages from steam, because if you search like "fallout" it gives you the fallout franchise page
        auth: config.googleToken
    };

    // This does the actual search results
    const res = await search.cse.list(options).catch(error => {
        logger.error(`Failed google custom search:\n${error}`);
    });

    // Gets the link from the google search results, obtains the first one that has 'app' in the link to avoid forum posts
    var link = res.data.items.find(item => {
        return item.link.includes('app');
    }).link;
    
    // Gets the steam id by splitting it with / and takes the last element of the steam url, which is the id
    // The epic thing is every single steam url is different so you have do some oddball shit just to get the ID
    // The app ID is (hopefully) always after 'app/' so we look for that and get the ID afterwards
    var gameID = link.split('/')[link.split('/').indexOf('app') + 1];

    // Checks to see if the wishlist already contains the game
    if(wishlist.games.some(game => game.id === gameID))
    {
        // Gets the game details from steam
        steam.getGameDetails(gameID).then(details => {
            // Gets the name from steam data
            var gameName = details.name;

            // Removes game from wishlist object, then writes it to the file
            wishlist.games.pop({"name" : gameName, "id" : gameID});
            fs.writeFileSync(`${__dirname}/../../../config/wishlist.json`, JSON.stringify(wishlist));

            // Notifies the user that the game was added
            message.reply(`Removed ${gameName} from wishlish\n${link}`);
            logger.info(`Removed game ${gameName} with id ${gameID} from wishlist`);

        }).catch(error => {
            logger.error(`Failed to add game ${gameToSearch} ${link} to wishlist\n${error}`);
        });
    }
    else
    {
        steam.getGameDetails(gameID).then(details => {
            message.reply(`${details.name} is not on the wishlist\n${link}`);
        });
    }
};
