const getBlockchainStats = async (req, res) => {
  try {
    // Simulated recent activities
    const recentActivity = [
      {
        type: "Product Created",
        hash: "0xabc123def4567890",
        time: new Date(Date.now() - 1000 * 60 * 10).toLocaleString(), // 10 minutes ago
        status: "confirmed",
      },
      {
        type: "Step Added",
        hash: "0xdef456abc1237890",
        time: new Date(Date.now() - 1000 * 60 * 5).toLocaleString(), // 5 minutes ago
        status: "confirmed",
      },
      {
        type: "Product Created",
        hash: "0x7890abc123def456",
        time: new Date(Date.now() - 1000 * 60 * 2).toLocaleString(), // 2 minutes ago
        status: "confirmed",
      },
    ];

    // Mock response
    res.json({
      network: `sepolia (Chain ID: 11155111)`,
      lastBlockNumber: 6669999,
      averageConfirmationTime: "12.5s",
      totalTransactions: 3,
      totalGasUsed: "1.23 M", // Optional
      contractAddress: "0xMockContractAddress123456789",
      recentActivity,
    });
  } catch (err) {
    console.error("❌ Blockchain stats error (mock):", err);
    res.status(500).json({ message: "Failed to fetch blockchain stats" });
  }
};

module.exports = {
  getBlockchainStats,
};
