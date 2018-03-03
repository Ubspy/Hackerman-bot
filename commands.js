const sleep = require('sleep');

module.exports.clearChannel = function (message)
{
  message.channel.fetchMessages().then(function(fetched)
  {
    var messages = fetched.array();


    for(var i = 0; i < messages.length; i++)
    {
      messages[i].delete();
    }
  });
  
  message.channel.send("Chat log has been cleared!");
}
