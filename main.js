import { ethers } from '../modules/ethers/dist/ethers.esm.min.js';
const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);

(async () => {
    await main();
})();

async function main(){
    await metamaskProvider.send("eth_requestAccounts", []);
}

async function getCurrentBlockNumber(){
    return await metamaskProvider.getBlockNumber()
}

document.getElementById("currentBlockButton").onclick = async function() {
    document.getElementById("currentBlockText").style.display= 'none' ;
    document.getElementById('currentBlockLoading').style.display= 'block' ;
    document.getElementById("currentBlockText").innerHTML = await getCurrentBlockNumber();
    document.getElementById("currentBlockText").style.display= 'block' ;
    document.getElementById('currentBlockLoading').style.display= 'none' ;
};