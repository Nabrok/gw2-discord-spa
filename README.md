# gw2-discord-spa

This will build a single page application that can interact with the graphql server provided by [gw2-discord-bot](https://github.com/Nabrok/gw2-discord-bot).

## Installation

```
$ npm install
$ npm run build
```

Copy the files in `dist` to your web server document root.

## Setup

In addition to the generated files, two json files are required to be in the document root.

### graphql.json

This file should contain the uri for the graphql server provided by gw2-discord-bot.

```json
{
	"uri": "https://api.mydiscordbot.example.com"
}
```

### oauth2.json

This file should contain information about your discord application for oauth2 purposes.

```json
{
	"clientId": "MY CLIENT ID FOR THE DISCORD APPLICATION",
	"redirectUri": "https://mydiscordbot.example.com/auth"
}
```

`redirectUri` must end with /auth.
