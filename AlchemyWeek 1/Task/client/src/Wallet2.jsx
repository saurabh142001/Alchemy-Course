//ethereum-cryptography: 2.0.0

import server from "./server";

import { secp256k1 } from 'ethereum-cryptography/secp256k1'
import { toHex } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak'
import { useEffect } from "react";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = toHex(secp256k1.getPublicKey(privateKey));
    // const publicKey = toHex(secp256k1.getPublicKey(privateKey));
    // const address = toHex(keccak256(publicKey.slice(1)).slice(-20));
    setAddress(address);
    
    if (address) {
      const { data: { balance }, } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        {/* Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={onChange}></input> */}
        Private Key
        <input placeholder="Type in a Private Key" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        Address: {address}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
