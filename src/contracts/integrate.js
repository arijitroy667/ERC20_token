import { ethers } from "ethers";

const INFURA_ID = import.meta.env.VITE_INFURA_API_KEY;
const address = import.meta.env.VITE_CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_ID}`);

const ERC20_ABI = [
    "function transfer(address _to, uint256 _value) external returns (bool)",
    "function approve(address _spender, uint256 _value) external returns (bool)",
    "function transferFrom(address _from,address _to,uint256 _value) external returns (bool)",
    "function mint(address _to, uint256 _value) external",
    "function burn(uint256 _value) external"
];

async function getContract() {
    // Get signer from MetaMask
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    // Create contract instance with signer
    return new ethers.Contract(address, ERC20_ABI, signer);
}

async function mint(account,amount){
    const contract = await getContract();
    const tx = await contract.mint(account, amount);
    await tx.wait();
    console.log(tx);
}

async function burn(amount){
    const contract = await getContract();
    const tx = await contract.burn(amount);
    await tx.wait();
    console.log(tx);
}

async function transfer(account,account2,value){
    const contract = await getContract();
    const tx = await contract.transferFrom(account,account2,value);
    await tx.wait();
    console.log(tx);
}

export {mint,burn,transfer};