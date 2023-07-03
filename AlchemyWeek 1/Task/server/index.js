const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils")

app.use(cors());
app.use(express.json());

const balances = {
  "045eee20c149d8cc1c464a90931a05e7937785879b63090ebd4904d40e5bfe484b633521db79014c7b2540329bdfbc02d01fdfa2a67cf0274944c1ef206ba2d72e": 100,
  "0461b06fc4a6e32eaadccda4c7e4ed81fffc4436be8ef23177d4c6b1b0f94e42e8fdc2aa429f9fd9aa7cbb475ab82b754ab4e79c7b8e506220230d9791c5b11357": 50,
  "04854cf49d0b506241fd55df19de8df630723154468560882e3f99ca559e75bdb9ac71dd9df4f14e7fe96f925515453dd4f3d4561e44459a4b85f193fdb9f2ece2": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  console.log("In Server : ");
  console.log(req.body);
  const { sender, recipient, amount, signature, recovery } = req.body;

  if (!signature) res.status(404).send({ message: "signature not provide" });
  if (!recovery) res.status(400).send({ message: "recovery not provide" });

  try {

    const bytes = utf8ToBytes(JSON.stringify({ sender, recipient, amount }));
    const hash = keccak256(bytes);

    const sig = new Uint8Array(signature);
    const publicKey = await secp.recoverPublicKey(hash, sig, recovery);
    console.log("Public Key :", publicKey);

    if (toHex(publicKey) !== sender) {
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
    console.log(error.message)
  }

});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}