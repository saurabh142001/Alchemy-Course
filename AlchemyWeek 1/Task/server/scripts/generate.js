const secp = require("ethereum-cryptography/secp256k1");
// const {secp} = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
// const {keccak256} = require("ethereum-cryptography/keccak")

const privatekey = secp.utils.randomPrivateKey();
console.log("Private Key : ", toHex(privatekey));

// const publickey = keccak256(secp.secp256k1.getPublicKey(privatekey).slice(1)).slice(-20);
const publickey = secp.getPublicKey(privatekey);
console.log("Public Key :", toHex(publickey));

