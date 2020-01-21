const fs = require('fs');
const {google} = require('googleapis');
const search = google.customsearch('v1');
const config = require('../../../config/config.json'); // Goes 3 folders back to get config file
const wishlist = require('../../../config/wishlist.json');
const request = require("request");

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
    // Seriously, valve please use consistent fucking urls
    var urlAppStr = link.split('/').find(element => element.includes("app"));
    var gameID = link.split('/')[link.split('/').indexOf(urlAppStr) + 1];

    // Checks to see if the wishlist already contains the game
    if(!wishlist.games.some(game => game.id === gameID))
    {
        // Notifies the user that the game was added
        message.reply(`Added ${gameName} to wishlish\n${link}`);

        // Node js steam api is big stinky so we're using the steam api through steam
        // You put the add ip in this link and it gives you fancy json with all the game ingo
        request({
            url: `https://store.steampowered.com/api/appdetails?appids=${gameID}`,
            json: true
        },
        (error, response, body) => {
            var data = body[gameID].data;

            if(error)
            {
                // This happens if the page couldn't be reached
                logger.error(`Something went horribly wrong when looking for info on ${gameName} with id ${gameID}: ` + error);
                message.reply("Something went horribly wrong, please check the log files");
            }
            else if(typeof data.price_overview == 'undefined')
            {
                // If there's no price overview, or if the game is free and there's no price set, then there won't be sale information
                message.reply(`Either this is a free game and you're dumb, or there's no price information avalible for the game yet, the game wasn't added to the wishlist`);
            }
            else
            {
                // Gets the current sale status
                var gameOnSale = (data.price_overview.discount_percent > 0);

                // Adds game to wishlist object, then writes it to the file
                wishlist.games.push({"name" : data.name, "id" : gameID, "link" : link, "onSale" : gameOnSale});
                fs.writeFileSync(`${__dirname}/../../../config/wishlist.json`, JSON.stringify(wishlist)); 
                
                logger.info(`Added game ${data.name} with id ${gameID} from wishlist`);
            }
        });
    }
    else
    {
        message.reply(`${gameName} is already on the wishlist\n${link}`);
    }
};