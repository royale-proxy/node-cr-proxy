# node-cr-proxy
[![clash royale](https://img.shields.io/badge/Clash%20Royale-1.9.2-brightred.svg?style=flat")](https://play.google.com/store/apps/details?id=com.supercell.clashroyale&hl=en)
[![licence](https://img.shields.io/aur/license/yaourt.svg?style=flat)](https://github.com/royale-proxy/node-cr-proxy/blob/master/LICENSE)

Clash Royale Proxy - Intercepts the traffic between your Clash Royale App and their servers, decrypts the protocol and decodes the messages.

Don't like NodeJs, prefer python? Get the [python proxy](https://github.com/royale-proxy/cr-proxy).

## How to use it?

### Setting up the proxy server

#### Prerequisites
* Install [nodejs](https://nodejs.org/en) (>=6.8.0)
* Install [node-gyp](https://github.com/nodejs/node-gyp)

#### Clone the code

`git clone https://github.com/royale-proxy/node-cr-proxy && cd node-cr-proxy`

`npm install`

`cp settings.json.example settings.json` / `copy settings.json.example settings.json`
  
### Setting up your device

#### Android
  * Please see [cr-patcher](https://github.com/royale-proxy/cr-patcher) for instructions on how to get your apk ready to use the proxy.

#### iPhone
  * We do not have a patcher at this time.

#### Running the proxy

  `node index`

  `node index --verbose` will display the contents of the messages on the screen as well as show debug info when messages are missing/incomplete
  
  `node index --dump ./packets` will save decrypted packets into the packets folder with a format of messageId.bin (ex: 10101.bin) -- Make sure the folder exists.
  
  `node index --replay ./packets/10101.bin` will decode the 10101 packet using definitions, useful when trying to decode a new message
  
  `node index --help` will show you the command line help
  
## What's the status?

This project has been abandoned

