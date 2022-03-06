import * as dotenv from "dotenv";
import { ethers } from "ethers";
dotenv.config();
var url = process.env.INFURA_ENDPOINT;

var init = function () {
    var customWsProvider = new ethers.providers.WebSocketProvider(url);

    customWsProvider.on("pending", (tx) => {
        customWsProvider.getTransaction(tx).then(function (transaction) {
            if (transaction && transaction["to"] === "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D") {
                console.log(transaction);
            }
        });
    });

    customWsProvider._websocket.on("error", async () => {
        console.log(`Unable to connect, retrying in 3s...`);
        setTimeout(init, 3000);
    });
    customWsProvider._websocket.on("close", async (code) => {
        console.log(
            `Connection lost with code ${code}! Attempting reconnect in 3s...`
        );
        customWsProvider._websocket.terminate();
        setTimeout(init, 3000);
    });
};

init();