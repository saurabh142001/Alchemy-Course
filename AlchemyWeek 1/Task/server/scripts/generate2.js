//ethereum-cryptography: 2.0.0

const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak")

const privateKey = secp256k1.utils.randomPrivateKey();
console.log(`Private Key:`, toHex(privateKey), "\n");
console.log(`Private Key 2:`, privateKey, "\n");

const publicKey = secp256k1.getPublicKey(privateKey);
console.log(`Public Key:`, toHex(publicKey), "\n");
console.log(`Public Key 2:`, publicKey, "\n");


// const address = keccak256(publicKey.slice(1)).slice(-20);
const address = toHex(keccak256(publicKey.slice(1)).slice(-20));
console.log("Address: ", address);
