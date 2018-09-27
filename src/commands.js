const sleep = require('sleep');

//Clears the chat logs
function clearMessages(message)
{
  //Gets all messages in the bot-commands channel
  message.channel.fetchMessages().then(function(messages)
  {
    //Bulk deletes all the messages
    message.channel.bulkDelete(messages);
  });

  //Sends a message
  message.channel.send("Chat log has been cleared!").then(function(thisMessage)
  {
    //After the message it sent, it waits three seconds and deletes itself
    sleep.sleep(3);
    thisMessage.delete();
  });
}

function linkSubreddit(message) {
  //String of the message
  var messageStr = message.toString();

  //Gets starting index of the subreddit
  var subCutoff = messageStr.substring(messageStr.indexOf('r/'), messageStr.length);

  //Check for a space to just get the raw subreddit
  var endingIndex = (subCutoff.indexOf(' ') > -1) ? subCutoff.indexOf(' ') : subCutoff.length;

  //Substring for the actual subreddit
  var subredditStr = subCutoff.substring(0, endingIndex);

  message.channel.send("OwO, what's this? I see a mention of a subreddit! Here's a link: http://reddit.com/"+subredditStr, {reply: message.author});
}

function getCommandChannels(client) 
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
module.exports.commandChannels = getCommandChannels
module.exports.linkReddit = linkSubreddit
module.exports.clear = clearMessages
