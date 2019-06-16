exports.name = "ping";
exports.desc = "Pings the bot to make sure it's up and running";
exports.args = [];

exports.run = (message, args, logger) => {
    logger.info('Pinged');
    message.channel.send('No u');
};