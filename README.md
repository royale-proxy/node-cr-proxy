# node-cr-proxy
![clash royale](https://img.shields.io/badge/Clash%20Royale-1.8.1-blue.svg?style=plastic")

Clash Royale Proxy - Intercepts the traffic between your Clash Royale App and their servers, decrypts the protocol and decodes the messages.

Don't like NodeJs, prefer python? Get the [python proxy](https://github.com/royale-proxy/cr-proxy).

## How to use it?

### Setting up the proxy server

#### Install NodeJS
* Get it [here](https://nodejs.org/en) (>=6.8.0)

#### Clone the code

  `git clone https://github.com/royale-proxy/node-cr-proxy && cd node-cr-proxy`

  `npm install`

  `cp settings.json.example settings.json` / `copy settings.json.example settings.json`

### Setting up your device

#### Android
  * Please see [cr-patcher](https://github.com/royale-proxy/cr-patcher) for instructions on how to get your apk ready to use the proxy.

#### iPhone
  * We do not have a patcher at this time.

## What's the status?

This is a work in progress, but the proxy is pretty much complete. We do need help defining the network messages, so head over to [cr-messages](https://github.com/royale-proxy/cr-messages), clone and contribute!

## I don't know what I'm doing, can you help me?

Please only use the issue tracker for actual bugs. If you need help, you are more than welcomed to join our [discord server](https://discord.gg/BuUtGPM).