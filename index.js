//Constants for discord client
const Discord = require('discord.js');
const client = new Discord.Client();

//On ready, output logged in message
client.on('ready', () =>
{
  console.log(`Logged in as ${client.user.tag}`);
});

//On a message, run this function
client.on('message', message =>
{
  //If the message sent isn't sent by the bot
  if(message.author != client.user)
  {
    //String to hold message content
    var messageStr = message.toString();

    //If the first character is '!' implying it's a command
    if(messageStr[0] == '!')
    {
      //Check for a space to just get the raw command
      var endingIndex = (messageStr.indexOf(' ') > -1) ? messageStr.indexOf(' ') : messageStr.length;

      //String to hold commands
      var command = messageStr.substring(1, endingIndex);

      //TODO: Add functions to link to commands here
    }
  }
});

//Login command with bot token
client.login('NDE4ODQzNzU2NDE1MDI1MTUy.DXneNg.qBxt2AQKrkJ36bKU8sDJyJVIZSU');
