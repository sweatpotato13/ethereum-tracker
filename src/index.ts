import * as dotenv from "dotenv";
import { ethers } from "ethers";
import abi from "../json/uniswap_v2_router_abi.json"
dotenv.config();
const url = process.env.INFURA_ENDPOINT;

async function main() {
    const customWsProvider = new ethers.providers.WebSocketProvider(url);
    const contract = new ethers.Contract("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", abi, customWsProvider);
    const iface = new ethers.utils.Interface(abi)

    customWsProvider.on("pending", (tx) => {
        customWsProvider.getTransaction(tx).then(function (transaction) {
            if (transaction && transaction["to"] == "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D") {
                try {
                    const data = iface.decodeFunctionData("swapExactETHForTokens", transaction.data);
                    console.log(transaction);
                    console.log(data);
                } catch (error) {
                    // DO NOTHING
                }
            }
        });
    });

    customWsProvider._websocket.on("error", async () => {
        console.log(`Unable to connect, retrying in 3s...`);
        setTimeout(main, 3000);
    });
    customWsProvider._websocket.on("close", async (code) => {
        console.log(
            `Connection lost with code ${code}! Attempting reconnect in 3s...`
        );
        customWsProvider._websocket.terminate();
        setTimeout(main, 3000);
    });
}

main();