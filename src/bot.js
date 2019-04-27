const {
    reddit,
    invite,
    logger
} = require('./index.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const log = logger("bot.js", "WHITE");
/**
 * @param {Object} config
   @prop {String} token [bot token]
   @prop {String} prefix [message command prefix]
 */
module.exports = config => {
    client.login(config.token)
    .then(() => {
        log("ready as " + client.user.username);
        client.on('message', msg => {
            if (msg.content.startsWith(config.prefix)) {
                let prefix = msg.content.toLowerCase().split(" ")[0];
                let body = msg.content.substr(prefix.length + 1); // +1 because space
                switch(prefix) {
                    case ".invite":
                        invite(msg);
                        break;
                }
            }
            if (msg.content.includes("r/") && !msg.content.toLowerCase().includes("reddit.com")) reddit(msg);
        });
    })
    .catch(log);

};
