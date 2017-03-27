'use strict';

var nacl = require("tweetnacl");
var blake2 = require("blake2");
var ByteBuffer = require("../../util/bytebuffer-sc");
var EMsg = require('../../enums/emsg');
const Crypto = require('../crypto.js');
const Nonce = require('../nonce.js');

class ClientCrypto extends Crypto {

    constructor(settings) {
        super();
        var kp = nacl.box.keyPair();

        this.privateKey = Buffer.from(kp.secretKey);
        this.clientKey = Buffer.from(kp.publicKey);
        this.serverKey = new Buffer(settings.serverKey, "hex");
        this.beforeNm(this.serverKey);
        this.setEncryptNonce();
    }

    setServer(server) {
        this.server = server;
    }

    decryptPacket(message) {
        if (message.messageType == EMsg.ServerHello || message.messageType == EMsg.LoginFailed) {
            var len = message.payload.readInt32LE();
            this.setSessionKey(message.payload.slice(4, 4 + len));
            message.decrypted = message.payload;
        } else if (message.messageType == EMsg.LoginOk) {
            var decrypted;
            var nonce = new Nonce({ clientKey: this.clientKey, serverKey: this.serverKey, nonce: this.encryptNonce });

            message.decrypted = this.decrypt(message.payload, nonce);

            if (message.decrypted) {
                this.setDecryptNonce(Buffer.from(message.decrypted.slice(0, 24)));
                this.server.setEncryptNonce(Buffer.from(message.decrypted.slice(0, 24)));
                this.setSharedKey(Buffer.from(message.decrypted.slice(24, 56)));

                message.decrypted = message.decrypted.slice(56);
            }
        } else {
            message.decrypted = this.decrypt(message.payload);
        }
    }

    encryptPacket(message) {
        if (message.messageType == EMsg.ClientHello) {
            message.encrypted = message.decrypted;
        } else if (message.messageType == EMsg.Login) {
            var nonce = new Nonce({ clientKey: this.clientKey, serverKey: this.serverKey });
            var toEncrypt = Buffer.concat([this.getSessionKey(), this.encryptNonce.getBuffer(), Buffer.from(message.decrypted)]);

            message.encrypted = Buffer.concat([this.clientKey, Buffer.from(this.encrypt(toEncrypt, nonce))]);
        } else {
            message.encrypted = this.encrypt(message.decrypted);
        }
    }
}

module.exports = ClientCrypto;
