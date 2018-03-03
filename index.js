//Constants for discord client
const Discord = require('discord.js');
const client = new Discord.Client();

//Constant for commands file
const Commands = require('./commands.js');

var commandChannels = [];

//On ready, output logged in message
client.on('ready', () =>
{
  console.log(`Logged in as ${client.user.tag}`);

  //Gets command channels where you put bot commands in
  commandChannels = getCommandChannels();
});

//On a message, run this function
client.on('message', message =>
{
  //If the message sent isn't sent by the bot
  var correctAuthor = message.author != client.user;

  //If the message is in a bot command channel
  var correctChannel = commandChannels.indexOf(message.channel.id) > -1;

  if(correctAuthor && correctChannel)
  {
    console.log(message.toString());

    //String to hold message content
    var messageStr = message.toString();

    //If the first character is '!' implying it's a command
    if(messageStr[0] == '!')
    {
      //Check for a space to just get the raw command
      var endingIndex = (messageStr.indexOf(' ') > -1) ? messageStr.indexOf(' ') : messageStr.length;

      //String to hold commands
      var command = messageStr.substring(1, endingIndex);

      if(command == "clear")
      {
        Commands.clearChannel(message);
      }
    }
  }
});

function getCommandChannels()
{
  //Variable of all channels the bot is connected to
  var activeChannels = client.channels.array();

  //Variable for command command channels
  var commandChannels = [];

  //Loops through all channels
  for(var i = 0; i < activeChannels.length; i++)
  {
    if(activeChannels[i].name == "bot-commands")
    {
      commandChannels.push(activeChannels[i].id);
    }
  }

  return commandChannels;
}

//Login command with bot token
client.login('NDE4ODQzNzU2NDE1MDI1MTUy.DXneNg.qBxt2AQKrkJ36bKU8sDJyJVIZSU');
