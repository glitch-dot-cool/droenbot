# droenbot
[glitch[dot]cool](https://glitch.cool)'s very own Discord bot, built with Node.js + sqlite3 + [Discord.js](https://discord.js.org/#/).

## quickstart

- clone this repo
- install dependencies with `npm i`
- install `knex` global dependency with `npm i -g knex`
- initialize database with `knex migrate:latest`
- add a `config.json` containing your bot's `token` and a command `prefix`
- start with `node bot.js` or `npm run develop` to run using nodemon for developing
