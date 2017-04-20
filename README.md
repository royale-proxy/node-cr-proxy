node-cr-proxy [![clash royale](https://img.shields.io/badge/Clash%20Royale-1.8.1-brightgreen.svg?style=flat")](https://play.google.com/store/apps/details?id=com.supercell.clashroyale&hl=en) [![licence](https://img.shields.io/aur/license/yaourt.svg?style=flat)](https://github.com/royale-proxy/node-cr-proxy/blob/master/LICENSE)
=============

Intercepts the traffic between Clash Royale and Supercell and decrypts then decodes the protocol

Don't like Node? Prefer Python? Get the [Python proxy](https://github.com/royale-proxy/cr-proxy)

## How to use it?

#### Prerequisites
* Install [Node](https://nodejs.org/en) (>=7.0.0)
* Install [node-gyp](https://github.com/nodejs/node-gyp)

Grab the code:

```
git clone https://github.com/royale-proxy/node-cr-proxy && cd node-cr-proxy
npm install
cp settings.json.example settings.json` / `copy settings.json.example settings.json
```

Then patch your game using [cr-patcher](https://github.com/royale-proxy/cr-patcher) (for instructions, see the link on how to get your apk ready to use the proxy)

For a quick start: `npm start`

Options:
- `--help` will show you the command line help
- `--verbose`will display the contents of the messages on the screen as well as show debug info when messages are missing/incomplete
- `--dump ./packets` will save decrypted packets into the packets folder with a format of messageId.bin (ex: 10101.bin) -- Make sure the folder exists
- `--replay ./packets/10101.bin` will decode the `10101` packet using definitions, useful when trying to decode a new message

## What's the status?

This is a work in progress, but the proxy is pretty much complete. We do need help defining the network messages, so head over to [cr-messages](https://github.com/royale-proxy/cr-messages), clone and contribute!

## I don't know what I'm doing, can you help me?

Please only use the issue tracker for actual bugs. If you need help, you are more than welcomed to join our [Discord server](https://discord.gg/BuUtGPM)
