# droenbot
[glitch[dot]cool](https://glitch.cool)'s very own Discord bot, built with Node.js + sqlite3 + [Discord.js](https://discord.js.org/#/).

## quickstart

- clone this repo
- install dependencies with `npm i`
- install `knex` global dependency with `npm i -g knex`
- initialize database with `knex migrate:latest`
- add a `config.json` containing your bot's `token` and a command `prefix`
- start with `node bot.js` or `npm run develop` to run using nodemon for developing

## a note on discord terminology

Discord's API has some slightly weird terminology which I don't always follow, so to quickly address that:

`Guild` = server

`Client` = bot

`Member` = user who is in a guild, distinct from `User`

## commands

Each command is a separate javascript file, structured like this:

```javascript
exports.run = (bot, message, args) => {
  // your command code here
}
```

**Commands are called by attaching the `prefix` defined in `config.json` with the name of the command file, minus the file extension.**

**ex. `stats.js` --> `!stats`**

Each command has access to the following, representing objects within the Discord API:

`bot`: [link to docs](https://discord.js.org/#/docs/main/stable/class/Client)

`message`: [link to docs](https://discord.js.org/#/docs/main/stable/class/Message)

`args`: Any arguments passed to the command expressed as an array of strings split on spaces. 

Ex. `!emojitext hello world` --> `["hello", "world"]`. 

###### Typically one of the first things you'll do in a command is determine how you will parse arguments, if any. Often you will want to use string methods like `.join()` and `.split()`.

## restricting use of commands by role

There's a built-in helper function under the `/utils` directory called `role_check()` which you can use to determine if the user who issued a command has a given role. This function will handle messages sent in-server and also DMs sent to Droenbot. `role_check()` accepts three parameters: `bot`, `message`, and `role` (the role you're testing for).

Usage:
```javascript
const role_check = require("../utils/role_check");
const is_mod = role_check(bot, message, "mod");

if (is_mod){
  // run admin-only command
} else message.reply("Sorry, you don't have permission to use this command!");
```

## want-list

### scheduling system
for scheduling things like votes, reminders, and periodic server announcements.

### poll system
database tables are already in-place, just need to implement.

### fun, query-able api-driven commands
things like `!wiki` or `!youtube`, but also maybe some artsy stuff like vsts or random creative commons assets or...sky's the limit really.
