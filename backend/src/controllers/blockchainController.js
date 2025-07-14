const { ethers } = require("ethers");
const rawABI = require("../config/abis/ProductTraceability.json");
const ABI = rawABI.abi;

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

const getBlockchainStats = async (req, res) => {
  try {
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    const fromBlock = Math.max(blockNumber - 1000, 0); 

    const stepEvents = await contract.queryFilter("StepAdded", fromBlock, blockNumber);
    const productEvents = await contract.queryFilter("ProductCreated", fromBlock, blockNumber);

    const formatEvent = async (event, type) => {
      const block = await provider.getBlock(event.blockNumber);
      return {
        type,
        hash: event.transactionHash,
        time: new Date(block.timestamp * 1000).toLocaleString(),
        status: "confirmed",
      };
    };

    const recentActivity = await Promise.all([
      ...productEvents.map(e => formatEvent(e, "Product Created")),
      ...stepEvents.map(e => formatEvent(e, "Step Added")),
    ]);

    recentActivity.sort((a, b) => new Date(b.time) - new Date(a.time));
    const latestActivity = recentActivity.slice(0, 10);

    res.json({
      network: `${network.name} (Chain ID: ${network.chainId})`,
      lastBlockNumber: blockNumber,
      averageConfirmationTime: "12.5s",
      totalTransactions: productEvents.length + stepEvents.length,
      totalGasUsed: "N/A",
      contractAddress: CONTRACT_ADDRESS,
      recentActivity: latestActivity,
    });
  } catch (err) {
    console.error("❌ Blockchain stats error:", err);
    res.status(500).json({ message: "Failed to fetch blockchain stats" });
  }
};

const Product = require("../models/Product");

module.exports = { getBlockchainStats };
