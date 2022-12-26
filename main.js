import { ethers } from "../node_modules/ethers/dist/ethers.esm.js";
const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
const rpcProvider = new ethers.providers.JsonRpcProvider("https://eth-goerli.g.alchemy.com/v2/zUOydiqRKAPMR39RIqcefp6DfpFrP0k-");

(async () => {
    await main();
})();

async function main(){
    await metamaskProvider.send("eth_requestAccounts", []);
    const metamaskSigner = metamaskProvider.getSigner()
}

async function getCurrentBlockNumber(){
    return await rpcProvider.getBlockNumber()
}

document.getElementById("currentBlockButton").onclick = async function() {
    document.getElementById("currentBlockText").innerHTML = await getCurrentBlockNumber();
};