const {google} = require('googleapis');
const search = google.customsearch('v1');
const config = require('../../../config/config.json'); // Goes 3 folders back to get config file

exports.name = "add";
exports.desc = "Add a steam game to the wishlist of games";
exports.args = ["game name"];

// This has to be an 
exports.run = async (message, args, logger) =>
{
    // Since this only takes one argument, and the name of some games have spaces, we're gonna join all the elements together from the args array
    var gameName = args.join(' ');

    // cx: custom engine key
    // q: search query
    // auth: api key
    const options = {
        cx: config.googleSearchEngineID,
        q: gameName,
        auth: config.googleToken
    };

    // This does the actual search results
    const res = await search.cse.list(options).catch(error => {
        logger.error(`Failed google custom search:\n${error}`);
    });

    // Gets the link from the google search results
    var link = res.data.items[0].link;

    // Gets the steam id by splitting it with / and takes the last element of the steam url, which is the id
    var gameID = link.split('/').pop();

    // Gets the name from the result title
    var gameName = res.data.items[0].title;

    // Notifies the user that the game was added
    message.reply(`Added ${gameName} to wishlish\n${link}`);
    
    console.log(gameID);
}