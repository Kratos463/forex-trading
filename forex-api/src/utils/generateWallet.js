const qrcode = require('qrcode');
const crypto = require('crypto-js');
const bip39 = require("bip39");
const { ethers } = require("ethers");
require("dotenv").config();

function generatebipWallet(pw, index) {
    // Generate seed from mnemonic

    const seed = bip39.mnemonicToSeedSync(process.env.MNEMONIC_PHRASE, pw);

    // Create the HDNode from the seed
    const hdNode = ethers.HDNodeWallet.fromSeed(seed);

    // Derive the wallet at the given index
    const wallet = hdNode.derivePath(`m/44'/60'/0'/0/${index}`);

    return wallet;
}


// Function to encrypt a private key
function encryptPrivateKey(privateKey) {
    return crypto.AES.encrypt(privateKey, process.env.AES_KEY).toString();
}


// Function to decrypt a private key
function decryptPrivateKey(encryptedPrivateKey) {
    const bytes = crypto.AES.decrypt(encryptedPrivateKey, process.env.AES_KEY);
    return bytes.toString(crypto.enc.Utf8);
}


// Function to generate QR code from text
async function generateQRCode(text) {
    try {
        return await qrcode.toDataURL(text);
    } catch (error) {
        console.error('Error generating QR code:', error);
        return null;
    }
}


module.exports = { encryptPrivateKey, decryptPrivateKey, generatebipWallet, generateQRCode };
