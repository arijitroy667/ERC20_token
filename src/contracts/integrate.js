import { ethers } from "ethers";

const INFURA_ID = import.meta.env.VITE_INFURA_API_KEY;
const address = import.meta.env.VITE_CONTRACT_ADDRESS;

const ERC20_ABI = [
    "function transfer(address _to, uint256 _value) external returns (bool)",
    "function approve(address _spender, uint256 _value) external returns (bool)",
    "function transferFrom(address _from,address _to,uint256 _value) external returns (bool)",
    "function mint(address _to, uint256 _value) external",
    "function burn(uint256 _value) external"
];

async function getContract() {
    if (!window.ethereum) {
        throw new Error("MetaMask not detected");
    }
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    if (!address) {
        throw new Error("Contract address is undefined");
    }
    
    return new ethers.Contract(address, ERC20_ABI, signer);
}

async function mint(account,amount){
    if (!account) throw new Error("Account address is required");
    if (!amount) throw new Error("Amount is required");

    const contract = await getContract();
    console.log("Minting to account:", account, "amount:", amount);
    const amountInWei = ethers.parseEther(amount.toString());
    const tx = await contract.mint(account, amountInWei);
    await tx.wait();
    return tx;
}

async function burn(amount){
    if (!amount) throw new Error("Amount is required");
    
    const contract = await getContract();
    const amountInWei = ethers.parseEther(amount.toString());
    const tx = await contract.burn(amountInWei);
    await tx.wait();
    return tx;
}

async function transfer(account,account2,value){
    if (!from) throw new Error("From address is required");
    if (!to) throw new Error("To address is required");
    if (!amount) throw new Error("Amount is required");
    
    const contract = await getContract();
    const amountInWei = ethers.parseEther(amount.toString());
    const tx = await contract.transferFrom(from, to, amountInWei);
    await tx.wait();
    return tx;
}

export {mint,burn,transfer};