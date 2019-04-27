/**
 * Saves time for generating an invite link for a new Discord bot.
 * @param {discord.js <Message>} msg
   {@link} https://discord.js.org/#/docs/main/stable/class/Message
 * @example
 .invite 164837347156951040
 */
const logger = require('../util/logger.js');
const log = logger("invite.js", "PURPLE");
module.exports = msg => {
    let id = msg.content.replace(/[^0-9]/g, "")
    log("Generating invite for '" + id + "'");
    msg.reply("https://discordapp.com/oauth2/authorize?client_id=" + id + "&scope=bot");
};
