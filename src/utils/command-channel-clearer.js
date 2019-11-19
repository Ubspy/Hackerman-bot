var schedule = require('node-schedule');
var clear = require('../commands/clear.js');

module.exports = (commandChannel, logger) => {
    // This job will run every monday at 6 PM
    var clearJob = schedule.scheduleJob('* 18 * * 0', () => {
        commandChannel.send('Performing weekly maintinance...').then(message => {
            // Runs the clear command, passes an empty array as the arguments since we don't need any
            clear.run(message, [], logger);
        });
    });
}