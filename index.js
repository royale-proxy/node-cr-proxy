'use strict';

var net = require('net');
var fs = require('fs');
var util = require('util');
var path = require('path');
var jsome = require('jsome');
var colors = require('colors');
var jsbytes = require('jsbytes');
var options = require('./util/usage').options;
var settings = require('./settings.json');

require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');

var PacketReceiver = require('./lib/packetreceiver');
var ClientCrypto = require('./lib/client/crypto');
var ServerCrypto = require('./lib/server/crypto');
var Definitions = require('./lib/definitions');
var EMsg = require('./enums/emsg');

var definitions = new Definitions(options);
var clients = {};

if(options.replay) {
    fs.readFile(options.replay.filename, {encoding: "binary"}, function(err, contents) {
        if(err) {
            return console.error(err);
        }
        var message = {
            messageType: parseInt(path.basename(options.replay.filename, ".bin")),
            decrypted: contents
        };

        definitions.decode(message);
        if(message.decoded) {
            jsome(message.decoded);
        }
    });
} else {
    var server = net.createServer();

    server.on('error', function(err) {
        if (err.code == 'EADDRINUSE') {
            console.log('Address in use, exiting...'.red);
        } else {
            console.log('Unknown error setting up proxy: ' + err);
        }

        process.exit(1);
    });

    server.on('listening', function() {
        console.log(('listening on ' + server.address().address + ':' + server.address().port).green);
    });

    server.on('connection', function(socket) {
        var gameserver = new net.Socket();
        socket.key = socket.remoteAddress + ":" + socket.remotePort;
        clients[socket.key] = socket;

        var clientPacketReceiver = new PacketReceiver();
        var serverPacketReceiver = new PacketReceiver();

        var clientCrypto = new ClientCrypto(settings);
        var serverCrypto = new ServerCrypto(settings);

        clientCrypto.setServer(serverCrypto);
        serverCrypto.setClient(clientCrypto);

        console.log('new client ' + socket.key + ' connected, establishing connection to game server...'.green);

        gameserver.connect(9339, "game.clashroyaleapp.com", function() {
            console.log('Connected to game server on ' + gameserver.remoteAddress + ':' + gameserver.remotePort);
        });

        gameserver.on("data", function(chunk) {
            serverPacketReceiver.packetize(chunk, function(packet) {
                var message = {
                    'messageType': packet.readUInt16BE(0),
                    'length': packet.readUIntBE(2, 3),
                    'version': packet.readUInt16BE(5),
                    'payload': packet.slice(7, packet.length)
                };

                console.log('[SERVER] ' + (EMsg[message.messageType] ? EMsg[message.messageType] + ' [' + message.messageType + ']' : message.messageType));

                clientCrypto.decryptPacket(message);

                if(options.dump) {
                    fs.writeFile(options.dump.filename + "/" + message.messageType + ".bin", Buffer.from(message.decrypted), {encoding: "binary"}, function(err) {
                        if(err) {
                            console.error(err);
                        }
                    });
                }

                definitions.decode(message);

                if(options.verbose && message.decoded && Object.keys(message.decoded).length) {
                    jsome(message.decoded);
                }

                serverCrypto.encryptPacket(message);

                var header = Buffer.alloc(7);

                header.writeUInt16BE(message.messageType, 0);
                header.writeUIntBE(message.encrypted.length, 2, 3);
                header.writeUInt16BE(message.version, 5);

                clients[socket.key].write(Buffer.concat([header, Buffer.from(message.encrypted)]));
            });
        });

        gameserver.on("end", function() {
            console.log('Disconnected from game server');
        });

        clients[socket.key].on('data', function(chunk) {
            clientPacketReceiver.packetize(chunk, function(packet) {
                var message = {
                    'messageType': packet.readUInt16BE(0),
                    'length': packet.readUIntBE(2, 3),
                    'version': packet.readUInt16BE(5),
                    'payload': packet.slice(7, packet.length)
                };

                console.log('[CLIENT] ' + (EMsg[message.messageType] ? EMsg[message.messageType] + ' [' + message.messageType + ']' : message.messageType));

                serverCrypto.decryptPacket(message);

                if(options.dump) {
                    fs.writeFile(options.dump.filename + "/" + message.messageType + ".bin", Buffer.from(message.decrypted), {encoding: "binary"}, function(err) {
                        if(err) {
                            return console.log(err);
                        }
                    });
                }

                definitions.decode(message);

                if(options.verbose && message.decoded && Object.keys(message.decoded).length) {
                    jsome(message.decoded);
                }

                clientCrypto.encryptPacket(message);

                var header = Buffer.alloc(7);

                header.writeUInt16BE(message.messageType, 0);
                header.writeUIntBE(message.encrypted.length, 2, 3);
                header.writeUInt16BE(message.version, 5);

                gameserver.write(Buffer.concat([header, Buffer.from(message.encrypted)]));
            });
        });

        clients[socket.key].on('end', function() {
            console.log('Client ' + socket.key + ' disconnected from proxy.');
            delete clients[socket.key];
            gameserver.end();
        });
    });

    server.listen({ host: '0.0.0.0', port: 9339, exclusive: true }, function(err) {
        if (err) {
            console.log(err);
        }
    });
}
