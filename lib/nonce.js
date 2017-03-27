'use strict';

var blake2 = require("blake2");
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
            var b2 = blake2.createHash('blake2b', { digestLength: 24 });
            if (arg.nonce) {
                b2.update(arg.nonce.getBuffer());
            }

            b2.update(arg.clientKey);
            b2.update(arg.serverKey);

            this.buffer = b2.digest();
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
