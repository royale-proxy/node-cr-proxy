'use strict';

var blake2 = require("blakejs");
var nacl = require("tweetnacl");

class Nonce {
    constructor(arg) {
        if (!arg.clientKey) {
            if (arg.nonce) {
                this.buffer = arg.nonce;
            } else {
                this.buffer = new Buffer(nacl.randomBytes(nacl.box.nonceLength));
            }
        } else {
            let b2 = blake2.blake2bInit(24);
            if (arg.nonce) {
                blake2.blake2bUpdate(b2, arg.nonce.getBuffer());
            }

            blake2.blake2bUpdate(b2, arg.clientKey);
            blake2.blake2bUpdate(b2, arg.serverKey);

            this.buffer = Buffer(blake2.blake2bFinal(b2));
        }
    }

    increment() {
        var integer;
        integer = this.buffer.readInt16LE(0);
        this.buffer.writeInt16LE(integer + 2, 0);
    }

    getBuffer() {
        return this.buffer;
    }
}

module.exports = Nonce;
