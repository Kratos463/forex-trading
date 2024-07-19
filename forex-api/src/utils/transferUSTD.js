const { ethers } = require("ethers");
const USDTWithdrawalTransaction = require("../models/usdtWithdrawalTransaction");
const Wallet = require("../models/wallet.model");
require("dotenv").config();

// Load environment variables
const mainWalletPrivateKey = process.env.MAIN_WALLET_PRIVATEKEY;
const bscProviderUrl = process.env.BSC_PROVIDER_URL;
const usdtContractAddress = process.env.USDT_CONTRACT_ADDRESS;

// Set up the provider and wallets
const provider = new ethers.JsonRpcProvider(bscProviderUrl);
const mainWallet = new ethers.Wallet(mainWalletPrivateKey, provider);

const usdtAbi = [
    // USDT contract ABI with balanceOf and transfer functions
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint256 amount) public returns (bool)"
];

const usdtContract = new ethers.Contract(usdtContractAddress, usdtAbi, provider);

const transferUsdtFromUserToMain = async (userWallet) => {
    try {
        // Check USDT balance of the user's wallet
        const balance = await usdtContract.balanceOf(userWallet.walletAddress);
        console.log(`User's USDT balance: ${balance} USDT`);

        if (balance === 0) {
            console.log("User's wallet has no USDT balance.");
            return;
        }

        // Convert balance to smallest unit (wei)
        const amountInWei = balance; // balance is already in smallest unit

        // Get the current gas price
        const gasPrice = (await provider.getFeeData()).gasPrice

        // Estimate gas limit for the transaction
        const gasLimit = await usdtContract.estimateGas.transfer(mainWallet.address, amountInWei, { from: userWallet.walletAddress });

        // Create the transaction object for the USDT transfer
        const tx = {
            to: usdtContractAddress,
            data: usdtContract.interface.encodeFunctionData("transfer", [mainWallet.address, amountInWei]),
            gasPrice: gasPrice,
            gasLimit: gasLimit,
            nonce: await mainWallet.getTransactionCount(),
        };

        // Sign the transaction with the user's wallet
        const signedTx = await userWallet.signTransaction(tx);

        // Send the transaction using the main wallet to pay the fee
        const sentTx = await mainWallet.sendTransaction({
            ...tx,
            from: mainWallet.address,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
            value: 0, // No need to transfer any BNB, just paying the gas fee
            nonce: await mainWallet.getTransactionCount(),
        });

        // Wait for the transaction to be mined
        const receipt = await sentTx.wait();
        console.log("Transaction successful with hash:", receipt.transactionHash);

        // Record the USDT withdrawal transaction in MongoDB
        const usdtWithdrawalTransaction = new USDTWithdrawalTransaction({
            user: userWallet.user,
            userWalletAddress: userWallet.walletAddress,
            mainWalletAddress: mainWallet.address,
            amount: ethers.utils.formatUnits(amountInWei, 18),
            transactionHash: receipt.transactionHash
        });

        await usdtWithdrawalTransaction.save();
        console.log("USDT withdrawal transaction saved successfully.");

        // Update user's wallet balance
        const userWalletDoc = await Wallet.findOne({ user: userWallet.user });
        if (!userWalletDoc) {
            console.error("User's wallet not found in database.");
            return;
        }

        userWalletDoc.balance += parseFloat(ethers.utils.formatUnits(amountInWei, 18));
        await userWalletDoc.save();
        console.log("User's wallet balance updated successfully.");
    } catch (error) {
        console.error("Error in transferUsdtFromUserToMain function:", error);
    }
}

module.exports = transferUsdtFromUserToMain;
