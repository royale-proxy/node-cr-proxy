'use strict';

var nacl = require("tweetnacl");
var blake2 = require("blake2");
var ByteBuffer = require("../util/bytebuffer-sc");
const Nonce = require("./nonce");

class Crypto {
    constructor(settings) {
        this.privateKey = null;
        this.serverKey = null;
        this.clientKey = null;
        this.sharedKey = null;
        this.decryptNonce = null;
        this.encryptNonce = null;
        this.sessionKey = null;
    }

    getSharedKey() {
        return this.sharedKey;
    }

    setSharedKey(sharedKey) {
        this.sharedKey = sharedKey;
    }

    getEncryptNonce() {
        return this.encryptNonce;
    }

    setEncryptNonce(nonce) {
        this.encryptNonce = new Nonce({ nonce: nonce });
    }

    getDecryptNonce() {
        return this.decryptNonce;
    }

    setDecryptNonce(nonce) {
        this.decryptNonce = new Nonce({ nonce: nonce });
    }

    setSessionKey(sessionKey) {
        this.sessionKey = sessionKey;
    }

    getSessionKey() {
        return this.sessionKey;
    }

    beforeNm(publicKey) {
        this.sharedKey = new Buffer(nacl.box.before(publicKey, this.privateKey));
    }

    encrypt(message, nonce) {
        if (!nonce) {
            this.encryptNonce.increment();
            nonce = this.encryptNonce;
        }

        return nacl.box.after(message, nonce.getBuffer(), this.sharedKey);
    }

    decrypt(cipherText, nonce) {
        var decrypted;
        if (!nonce) {
            this.decryptNonce.increment();
            nonce = this.decryptNonce;
        }

        decrypted = nacl.box.open.after(cipherText, nonce.getBuffer(), this.sharedKey);

        if (decrypted) {
            return decrypted;
        } else {
            console.log('unable to decrypt message. exiting.');
            process.exit(1);
        }
    }
}

module.exports = Crypto;
