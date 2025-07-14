const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const contractABI = require("./abis/ProductTraceability.json").abi;

const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
const wallet = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

module.exports = contract;