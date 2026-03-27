export const CONTRACT_ADDRESS = "0x59B7Cbee36075ED66FA04790770eD9d51404E810" as `0x${string}`;

export const ABI = [
  {
    type: "function", name: "createPool",
    inputs: [{ name: "lockDuration", type: "uint256" }, { name: "penaltyBps", type: "uint256" }],
    outputs: [{ name: "poolId", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function", name: "deposit",
    inputs: [{ name: "poolId", type: "uint256" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function", name: "rageQuit",
    inputs: [{ name: "poolId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function", name: "claim",
    inputs: [{ name: "poolId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function", name: "getPool",
    inputs: [{ name: "poolId", type: "uint256" }],
    outputs: [{
      name: "", type: "tuple",
      components: [
        { name: "creator", type: "address" },
        { name: "lockEnd", type: "uint256" },
        { name: "penaltyBps", type: "uint256" },
        { name: "totalStake", type: "uint256" },
        { name: "bonusPool", type: "uint256" },
      ],
    }],
    stateMutability: "view",
  },
  {
    type: "function", name: "getStake",
    inputs: [{ name: "poolId", type: "uint256" }, { name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function", name: "poolCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function", name: "claimed",
    inputs: [{ name: "", type: "uint256" }, { name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
] as const;
