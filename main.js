import { ethers } from '../modules/ethers/dist/ethers.esm.min.js';

////////////////////////////////////////
// Constants
const tomatoTokenAddress = "0x78b883811F0E7c5551A52cC8DCD6CF37e30e2756";
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
    } catch(e){

    }
    await checkConnection();
}

async function checkConnection() {
    if(metamaskProvider == null) return;

    try{
        signer = metamaskProvider.getSigner();
        console.log("Account:", await signer.getAddress());
    } catch(e) {
        document.getElementById("metaMaskStatus").innerHTML = "Status: Not Connected";
        document.getElementById("metaMaskStatus").style.color = "red";
        return;
    } 
    document.getElementById("metaMaskStatus").innerHTML = "Status: Connected";
    document.getElementById("metaMaskStatus").style.color = "green";
}

async function getCurrentBlockNumber(){
    if(metamaskProvider == null) return;

    return await metamaskProvider.getBlockNumber()
}

async function getCurrentTomatoTokenBalance(){
    if(metamaskProvider == null) return;
    
    if(signer == null) return;

    if(erc20 == null){
        try {
            erc20 = new ethers.Contract(tomatoTokenAddress, abi, signer);
        } catch(e) {
            // TODO error handling
            return -1;
        }
    }

    try {
        return await erc20.balanceOf(signer.getAddress())
    } catch(e) {
        // TODO error handling
        return -1;
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