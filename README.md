# Hackerman bot
This Discord bot has no particular functionality rather than fitting the needs of the author. Before starting the bot populate [`./config/bot-config.js`](./config/bot-config.js) with a token and prefix that the bot will use.

## Starting
`npm start` once [`/config/bot-config.js`](./config/bot-config.js) is populated.

## Current Functionality
[`/src/commands/`](./src/commands/)
 - [`invite.js`](./src/commands/invite.js): The invite command builds an invite link for Discord bots. It pulls the ID provided in a message and responds with a link. Disclaimer the bot does not do any thorough search that the bot exists, so it assumes that the ID is legit. 
   - usage example: `.invite 164837347156951040`
 - [`reddit.js`](./src/commands/reddit.js): If a message includes "r/", the bot will assume that it is short for a subreddit page, before responding the bot will send a GET request to the alleged subreddit if it receives a 200 status code it will reply with a hyperlink.
  - usage example: `Check out this subreddit! r/discordapp`
