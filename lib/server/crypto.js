'use strict';

var nacl = require("tweetnacl");
var blake2 = require("blake2");
var ByteBuffer = require("../../util/bytebuffer-sc");
var EMsg = require('../../enums/emsg');
const Crypto = require('../crypto.js');
const Nonce = require('../nonce.js');

class ServerCrypto extends Crypto {
    constructor(settings) {
        super();
        this.privateKey = new Buffer("1891d401fadb51d25d3a9174d472a9f691a45b974285d47729c45c6538070d85", "hex");
        this.serverKey = new Buffer("72f1a4a4c48e44da0c42310f800e96624e6dc6a641a9d41c3b5039d8dfadc27e", "hex");
    }

    setClient(client) {
        this.client = client;
    }

    decryptPacket(message) {
        if (message.messageType == EMsg.ClientHello) {
            message.decrypted = message.payload;
        } else if (message.messageType == EMsg.Login) {

            this.clientKey = message.payload.slice(0, 32);
            var cipherText = message.payload.slice(32);

            this.beforeNm(this.clientKey, this);

            var nonce = new Nonce({ clientKey: this.clientKey, serverKey: this.serverKey });

            message.decrypted = this.decrypt(cipherText, nonce);

            if (message.decrypted) {
                this.setSessionKey(Buffer.from(message.decrypted.slice(0, 24)));
                this.setDecryptNonce(Buffer.from(message.decrypted.slice(24, 48)));
                this.client.setEncryptNonce(Buffer.from(message.decrypted.slice(24, 48)));

                message.decrypted = message.decrypted.slice(48);
            }
        } else {
            message.decrypted = this.decrypt(message.payload);
        }
    }

    encryptPacket(message) {
        if (message.messageType == EMsg.ServerHello || message.messageType == EMsg.LoginFailed) {
            message.encrypted = message.decrypted;
        } else if (message.messageType == EMsg.LoginOk) {
            var nonce = new Nonce({ clientKey: this.clientKey, serverKey: this.serverKey, nonce: this.decryptNonce });
            var toEncrypt = Buffer.concat([this.encryptNonce.getBuffer(), this.client.getSharedKey(), Buffer.from(message.decrypted)]);

            var cipherText = this.encrypt(toEncrypt, nonce);

            this.setSharedKey(this.client.getSharedKey()); // is this what I was missing, omg

            message.encrypted = cipherText;
        } else {
            message.encrypted = this.encrypt(message.decrypted);
        }
    }
}

module.exports = ServerCrypto;
