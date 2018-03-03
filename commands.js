const sleep = require('sleep');

//Clears the chat logs
module.exports.clearChannel = function(message)
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
