# Commands
Here are all the bot functionalities that it interacts uses. When a new command is added (that uses the prefix) implement it into the switch statement in bot.js.

## Command exports
- **Name:** the name of the command, what the users type in to run the command
- **Desc:** this is for the help command, it explains what the command does
- **Args:** arguments needed to run command, set this to an array of strings (empty if none)
- **Run:** this is the actual run function, it has three passing parameters which are (message, args, logger)