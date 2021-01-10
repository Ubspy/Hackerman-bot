/**
 * @file ping.js
 * @author Ubspy
 * @desc
   Pings the bot to make sure it's not dead
 *
 * @param {discord.js <Message>}, message [Message object to work with]
 {@link} https://discord.js.org/#/docs/main/stable/class/Message
 * @param args, arguments to the command provided by the user
 * @param {log4js <Logger>}, logger [The logger object that will write important data to the log files]
 {@link} https://log4js-node.github.io/log4js-node/
**/

exports.name = "ping";
exports.desc = "Pings the bot to make sure it's up and running";
exports.args = [];

exports.run = (message, args, logger) => {
	logger.info('Pinged');
	message.channel.send('No u');
}