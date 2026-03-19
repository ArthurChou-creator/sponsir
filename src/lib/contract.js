import { createWalletClient, createPublicClient, custom, http } from "viem";
import { defineChain } from "viem";

// X Layer Mainnet
export const xlayer = defineChain({
  id: 196,
  name: "X Layer",
  nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.xlayer.tech"] },
  },
  blockExplorers: {
    default: { name: "OKX Explorer", url: "https://www.okx.com/explorer/xlayer" },
  },
});

export const CONTRACT_ADDRESS = "0xC6bBee3228434F8ae468B1B4Dc74DDCBf1b55b11";

export const CONTRACT_ABI = [
  {
    name: "record",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "eventId",    type: "string" },
      { name: "planId",     type: "string" },
      { name: "eventTitle", type: "string" },
      { name: "planTitle",  type: "string" },
      { name: "amount",     type: "uint256" },
    ],
    outputs: [{ name: "id", type: "uint256" }],
  },
  {
    name: "totalSponsorships",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "SponsorshipRecorded",
    type: "event",
    inputs: [
      { name: "id",        type: "uint256", indexed: true },
      { name: "sponsor",   type: "address", indexed: true },
      { name: "eventId",   type: "string",  indexed: false },
      { name: "planId",    type: "string",  indexed: false },
      { name: "amount",    type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
];

/**
 * Record a sponsorship onchain.
 * @param {object} params - { eventId, planId, eventTitle, planTitle, price }
 * @returns {string} txHash
 */
export async function recordSponsorship({ eventId, planId, eventTitle, planTitle, price }) {
  const provider = window.okxwallet || window.ethereum;
  if (!provider) throw new Error("No wallet detected");

  const walletClient = createWalletClient({
    chain: xlayer,
    transport: custom(provider),
  });

  const [account] = await walletClient.requestAddresses();

  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "record",
    args: [
      eventId,
      planId,
      eventTitle,
      planTitle,
      BigInt(price), // amount (demo uses $1 = 1)
    ],
    account,
  });

  return hash;
}
