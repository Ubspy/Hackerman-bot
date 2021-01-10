/**
 * @file roll.js
 * @author Ubspy
 * @desc
   Simulates rolling one or many dice
 *
 * @param {discord.js <Message>}, message [Message object to work with]
 {@link} https://discord.js.org/#/docs/main/stable/class/Message
 * @param args, arguments to the command provided by the user
 * @param {log4js <Logger>}, logger [The logger object that will write important data to the log files]
 {@link} https://log4js-node.github.io/log4js-node/
**/

exports.name = "roll";
exports.desc = "Rolls one or more dice using standard dice notation";
exports.args = ['dice'];

exports.run = (message, args, logger) => {
	// Stores roll results
	var rollResults = [];

	args.forEach(die => {
		// Checks for standard notation
		if(die.includes('d'))
		{
			var nums = die.split('d');

			// Makes sure it only splits into two segments
			if(nums.length != 2)
			{
				message.reply(`${die} has too many properties, try \`<number of dice>\`d\`<dice sides>\``);
				return;
			}

			// Before we check for numbers, we need to turn a blank first argument into a 1
			var rolls = nums[0] == '' ? 1 : nums[0];
			var diceSides = nums[1];

			// Checks for numbers on each side of the 'd' character
			if(Number.isInteger(rolls) && Number.isInteger(diceSides))
			{
				message.reply(`${die} doesn't include integers, try \`<number of dice>\`d\`<dice sides>\``);
				return;
			}

			// Set up roll object
			var roll = {sides: `${diceSides}`, rolls: []};

			// Once all the checking is done, time to roll the dice
			for(var i = 0; i < rolls; i++)
			{
				// Why the minus 1 then plus 1? Well random generates a number between 0 and 1, so if we multiply it by 20 for example
				// It will generate a number from 0 to 20, we want from 1 to 20, so we make it go from 1 to 19 instead
				// Afterwards, we add the 1, which makes it from 1 to 20 :)
				roll.rolls.push(Math.floor(Math.random() * (diceSides - 1) + 1));
			}

			// Adds roll results to total roll results
			rollResults.push(roll);

		}
		else
		{
			message.reply(`${die} is not in proper notation, try \`<number of dice>\`d\`<dice sides>\``);
			return;
		}
	});

	// Start formatting
	var rollString = '```\n';

	rollResults.forEach(rollResult => {
		// Adds dice sides to the string
		rollString += `d${rollResult.sides}: `

		// Adds each roll
		rollResult.rolls.forEach(roll => {
			rollString += `${roll}, `
		});

		// Remove last two characters, which will be an extra comma and space, then add a new line
		rollString = rollString.substring(0, (rollString.length - 2)) + `\n`;
	});

	// Finish formatting
	rollString += '```';

	// Send the actual message with error catch
	message.channel.send(rollString)
		.then(() => {
			logger.info("Rolled dice");
		}).catch(error => {
			logger.error(`Failed to roll dice:\n${error}`);
		});
}