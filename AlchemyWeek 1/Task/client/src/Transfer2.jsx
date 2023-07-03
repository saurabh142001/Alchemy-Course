//ethereum-cryptography: 2.0.0

import { useState } from "react";
import server from "./server";
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak'
import { utf8ToBytes } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const allData = {sender: address, amount: parseInt(sendAmount), recipient};
    // console.log(allData)
    const bytes = utf8ToBytes(JSON.stringify(allData));
    // console.log(bytes)
    const hash = keccak256(bytes);
    // console.log("toHex of hash in Transfer: ",toHex(hash));
    console.log("Hash in transfer",hash)

    console.log("Private Key:", privateKey);
    const finalPrivateKey = new TextEncoder("utf-8").encode(privateKey);
    const privateKeyBytes = new Uint8Array(privateKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    // console.log("Final Private Key:", finalPrivateKey);
    console.log("uint8Array Private Key:", privateKeyBytes);


    const publicKey = secp256k1.getPublicKey(privateKeyBytes);
    console.log("Public Key:",publicKey);

    const finalPublicKey = toHex(publicKey);
    console.log("Final Public Key:",finalPublicKey)


    const signature = secp256k1.sign(hash, privateKeyBytes);
    console.log(signature);


    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        // ...allData, signature: signature.toString(), hash, publicKey, finalPublicKey});
        ...allData, signature: [signature.r.toString(), signature.s.toString(), signature.recovery], hash, publicKey, finalPublicKey});
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
