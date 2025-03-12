import React from "react";
import { ethers } from "ethers";
import { useWallet } from './context';

const ConnectWallet = () => {
  const {account, setAccount} = useWallet();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask.");
    }
  };

  return (
    <button
      onClick={connectWallet}
      className="px-6 py-2 text-lg font-semibold bg-fuchsia-500 hover:bg-emerald-400 text-white rounded-lg shadow-md transition-all duration-300"
    >
      {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
    </button>
  );
};

export default ConnectWallet;
