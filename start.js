const bot = require('./src/bot.js');
const config = require('./config/bot-config.js');

(() => {
    bot(config);
})()
