//ethereum-cryptography: 2.0.0

const { secp256k1 } = require("ethereum-cryptography/secp256k1");
// const { secp256k1 } = require("@noble/secp256k1")
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
// const { ec } = require('elliptic');

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
    //16f60d7ec671686f134a725f9643c58fe22b6cac4e7b1f215966444885724fe5
    "0258feeb480bd133f2629d799dcd92a277476f5ee2aa40223d69f3c74488a3bd2f": 100,
    //353a78f82f4164ebcc0df87cc7da04819c73d41c446bcce1705e2f11ecd59709
    "02919f65d6ef1728171bce8d742176663970930e431720484593b9934118040a3c": 50,
    //d6ad12d2ac360fd2f30bdb1d11986a8e06da6989443d326ccd07f39d9670d066
    "03b58410f02f53c4cea7c7c2c070e8851c515bdf268eafec5f4dd1ff1af57fcd16": 75,
};

app.get("/balance/:address", (req, res) => {
    const { address } = req.params;
    const balance = balances[address] || 0;
    res.send({ balance });
});

app.post("/send", async (req, res) => {
    console.log("in send server...");
    console.log(req.body);
    const { sender, recipient, amount, signature, recovery, hash, publicKey, finalPublicKey } = await req.body;
    // if (!signature) res.status(404).send({ message: "signature was not provided" });
    // if (!recovery) res.status(400).send({ message: "recovery was not provided" });
    try {

        const bytes = utf8ToBytes(JSON.stringify({ sender, recipient, amount }));
        const hash2 = keccak256(bytes);


        console.log("hash2..:", hash2)
        console.log("signature: ", signature)
        console.log("signatureR: ", signature[0])
        // const sig = new TextEncoder("utf-8").encode(signature);
        // const sig = new Uint8Array(signature.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        // console.log("sig:", sig)
        // console.log("AMount: ", amount)
        // console.log("Balances", balances)
        // console.log("Pub: ", publicKey)
        // console.log("hash in index server", hash);

        // const sign = [
        //   signature[0],
        //   signature[1]
        // ]

        const sign = {
            r: signature[0],
            s: signature[1]
        };

        const r = signature.r;
        const s = signature.s;

        const newR = new Uint8Array(signature[0].match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        console.log(newR);
        const newS = new Uint8Array(signature[1].match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        console.log(newS);

        // const signatureBytes = new Uint8Array([r, s]);
        // console.log("sigByt: ", signatureBytes)
        // const reversedSignatureBytes = new Uint8Array(signatureBytes.reverse());
        // console.log("rev: ", reversedSignatureBytes);

        const isSigned = secp256k1.verify({ newR, newS }, hash2, finalPublicKey);
        console.log("isSigned: ", isSigned)

        if (finalPublicKey !== sender && !isSigned) {
            res.status(400).send({ message: "signature is not valid" });
        }

        setInitialBalance(sender);
        setInitialBalance(recipient);

        if (balances[sender] < amount) {
            res.status(400).send({ message: "Not enough funds!" });
        } else {
            balances[sender] -= amount;
            balances[recipient] += amount;
            res.send({ balance: balances[sender] });
        }
    } catch (error) {
        console.log("error in catch block: ", error)
    }
});


//   setInitialBalance(sender);
//   setInitialBalance(recipient);

//   if (balances[sender] < amount) {
//     res.status(400).send({ message: "Not enough funds!" });
//   } else {
//     balances[sender] -= amount;
//     balances[recipient] += amount;
//     res.send({ balance: balances[sender] });
//   }
// });

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
    if (!balances[address]) {
        balances[address] = 0;
    }
}
