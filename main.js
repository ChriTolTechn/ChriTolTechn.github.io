import { ethers } from '../modules/ethers/dist/ethers.esm.min.js';

////////////////////////////////////////
// Constants
const tomatoTokenAddress = "0x78b883811F0E7c5551A52cC8DCD6CF37e30e2756";
const recipientAddress = "0x15433DA387451F9dE4565280C85506CB71aF9376";
const abi = [
    // Read-Only Functions
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",

    // Authenticated Functions
    "function transfer(address to, uint amount) returns (bool)",

    // Events
    "event Transfer(address indexed from, address indexed to, uint amount)"
];

////////////////////////////////////////
// Variables
var metamaskProvider;
var erc20;
var signer;

////////////////////////////////////////
// Main
try {
    metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
} catch(e){
    console.log(e);
    document.getElementById("metaMaskStatus").innerHTML = "Status: Metamask not available";
    document.getElementById("metaMaskStatus").style.color = "yellow";
}

(async () => {
    await connectToMetamask();
})();

////////////////////////////////////////
// Functions
async function connectToMetamask(){
    if(metamaskProvider == null) return;

    try {
        await metamaskProvider.send("eth_requestAccounts", []); 
        signer = metamaskProvider.getSigner();
        erc20 = new ethers.Contract(tomatoTokenAddress, abi, signer);
    } catch(e){
        console.log(e);
    }
    await checkConnection();
}

async function checkConnection() {
    if(metamaskProvider == null) return;

    try{
        console.log("Account:", await signer.getAddress());
    } catch(e) {
        console.log(e);
        document.getElementById("metaMaskStatus").innerHTML = "Status: Not Connected";
        document.getElementById("metaMaskStatus").style.color = "red";
        return;
    } 
    document.getElementById("metaMaskStatus").innerHTML = "Status: Connected";
    document.getElementById("metaMaskStatus").style.color = "green";
}

// Exercise 6, 1
async function getCurrentBlockNumber(){
    if(metamaskProvider == null) return;

    return await metamaskProvider.getBlockNumber()
}

// Exercise 6, 2
async function getCurrentTomatoTokenBalance(){
    if(metamaskProvider == null) return;
    if(signer == null) return;
    if(erc20 == null) return;

    try {
        return await erc20.balanceOf(signer.getAddress())
    } catch(e) {
        console.log(e);
        return -1;
    }
}

// Exercise 6, 3
async function transferToken(){
    if(metamaskProvider == null) return;
    if(signer == null) return;
    if(erc20 == null) return;

    try {
        ethers.utils.formatUnits(await erc20.balanceOf(signer.getAddress()));
        document.getElementById("sendToAccountText").innerHTML = "Waiting for confirmation";
        var tx = await erc20.transfer(recipientAddress, ethers.utils.parseUnits("10"));
        await tx.wait();
        return true;
    } catch(e) {
        console.log(e);
        return false;
    }
}

////////////////////////////////////////
// Event Handler
document.getElementById("currentBlockButton").onclick = async function() {
    if(metamaskProvider == null) return;

    document.getElementById("currentBlockText").innerHTML = await getCurrentBlockNumber();
};

document.getElementById("connectMetamaskButton").onclick = async function() {
    if(metamaskProvider == null) return;

    await checkConnection();
    await connectToMetamask();
};

document.getElementById("tomatoTokenBalanceButton").onclick = async function() {
    if(metamaskProvider == null) return;

    var balance = await getCurrentTomatoTokenBalance();
    if(balance >= 0){
        document.getElementById("currentTomatoTokenText").innerHTML = ethers.utils.formatEther(balance) + " TMT";
    }
};

document.getElementById("sendToAccountButton").onclick = async function() {
    if(metamaskProvider == null) return;

    var success = await transferToken();
    if(success) {
        document.getElementById("sendToAccountText").innerHTML = "Success";
    } else {
        document.getElementById("sendToAccountText").innerHTML = "Failed";
    }
};