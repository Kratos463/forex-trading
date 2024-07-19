const Wallet = require("../models/wallet.model");
const mongoose = require("mongoose");
const USDTWithdrawalTransaction = require("../models/usdtWithdrawalTransaction");
require("dotenv").config();
const { ethers } = require("ethers");

const mainWalletPrivateKey = process.env.MAIN_WALLET_PRIVATEKEY;
const bscProviderUrl = process.env.BSC_PROVIDER_URL;
const usdtContractAddress = process.env.USDT_CONTRACT_ADDRESS;

// Set up the provider and wallets
const provider = new ethers.JsonRpcProvider(bscProviderUrl);
const mainWallet = new ethers.Wallet(mainWalletPrivateKey, provider);

// USDT contract ABI (simplified, you may need to adjust)
const usdtAbi = [
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
];


const addAmountInWallet = async (req, res) => {
    try {
        console.log("Function called");

        const wallet = await Wallet.findOne({ user: req.user._id });
        if (!wallet) {
            return res.status(400).json({ error: "No wallet found for the current logged-in user", success: false });
        }

        // geeting user wallet on block chin 
        const userWallet = new ethers.Wallet(wallet.walletPrivateKey, provider);
        // make contract for user wallet
        const usdtContract = new ethers.Contract(usdtContractAddress, usdtAbi, userWallet);
        // getting balance of user wallet
        const usdtBalance = await usdtContract.balanceOf(userWallet.address);

        if (usdtBalance >= 1) {
            const gasPrice = (await provider.getFeeData()).gasPrice;
            console.log(`Gas Price : ${gasPrice}`);

            const gasLimit = await usdtContract.transfer.estimateGas(
                mainWallet.address,
                usdtBalance
            );

            // const nonce = await provider.getTransactionCount(userWallet.address);

            const gasCost = ethers.formatEther(gasPrice * gasLimit);

            const feeTx = {
                to: userWallet.address,
                value: ethers.parseEther(gasCost),
            };

            const feeTxResponse = await mainWallet.sendTransaction(feeTx);
            await feeTxResponse.wait();

            const txUsdt = await usdtContract.transfer(mainWallet.address, usdtBalance);
            await txUsdt.wait();

            const newUSDTTransaction = new USDTWithdrawalTransaction({
                user: wallet.user,
                gasHash: feeTxResponse.hash,
                transactionHash: txUsdt.hash,
                userWalletAddress: wallet.walletAddress,
                mainWalletAddress: mainWallet.address,
                amount: parseFloat(ethers.formatUnits(usdtBalance, 6)).toFixed(2)
            })

            await newUSDTTransaction.save()

            // Update the wallet balance
            wallet.balance += parseFloat(ethers.formatUnits(usdtBalance, 6)).toFixed(2)

            await wallet.save()

        } else {
            console.log("No Balance found in user wallet! Please try again later.");
            return res.status(400).json({ error: 'No balance in user wallet', success: false });
        }
        return res.status(200).json({ message: `Amount has been successfully added to your wallet`, success: true });
    }

    catch (error) {
        console.error('Error during adding amount to wallet:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
}

const getCurrentUserWalletDetails = async (req, res) => {
    try {
        const walletDetails = await Wallet.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
            {
                $lookup: {
                    from: 'transactions',
                    let: { userId: '$user' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$user', '$$userId'] } } },
                        {
                            $project: {
                                _id: 1,
                                amount: 1,
                                type: 1,
                                details: 1,
                                transactionDate: 1,
                                commissionType: 1
                            }
                        }
                    ],
                    as: 'transactions'
                }
            },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    balance: 1,
                    selfRoi: 1,
                    teamRoi: 1,
                    totalInvestment: 1,
                    directReferral: 1,
                    walletAddress: 1,
                    walletQrCode: 1,
                    transactions: 1,
                    'securitySettings.twoFactorAuthEnabled': 1,
                }
            }
        ]);

        if (!walletDetails) {
            return res.status(400).json({ error: "No wallet found for the current logged-in user", success: false });
        }

        return res.status(200).json({ success: true, message: "User wallet details fetched successfully", wallet: walletDetails });
    } catch (error) {
        console.error('Error fetching user wallet details:', error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }
}

const walletTransactionList = async(req, res)=> {
    const userId = req.user._id
    try {
        const transactions = await USDTWithdrawalTransaction.find({user: userId}).select("createdAt transactionHash user _id amount")

        if(!transactions){
            return res.status(400).json({error: "No transaction found", success: false})
        }

        return res.status(200).json({message: "Transactions list", success: true, transactions: transactions})

    } catch (error) {
        console.error('Error while fetching user transaction list:', error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }
}

module.exports = {
    addAmountInWallet,
    getCurrentUserWalletDetails,
    walletTransactionList
};
