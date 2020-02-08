const fs = require('fs');

exports.name = "list";
exports.description = "Lists all playable files";
exports.args = [];

exports.run = (message, args, logger) => {
    // Here we gotta list files in the audio folder
    messageStr = "Here are the playable files:\n```\n";

    // Read the audio folder and for each mp3 file it'll add that to the list
    fs.readdirSync(`${__dirname}/../../../audio/`)
    .filter(file => file.endsWith('.mp3'))
    .forEach(file => {
        messageStr += file + '\n';
    });

    messageStr += "```"; // Ends string formatting
    message.channel.send(messageStr).then(() => {
        logger.info('Listed audio files');
    }).catch(error => {
        logger.error(`Error listing audio files:\n${error}`)
    });
};