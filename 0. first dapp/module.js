//A Wallet Client is an interface to interact with Ethereum Accounts.
//The createWalletClient function sets up a Wallet Client with a given medium.

import {
	createWalletClient,
	custom,
	getContract,
  } from "https://esm.sh/viem";
  import { sepolia } from "https://esm.sh/viem/chains";

//create a client that connects the user's account to Ethereum Sepolia
const walletClient = createWalletClient({
	chain: sepolia,
	transport: custom(window.ethereum),
  });

//this will make your wallet extension show you a pop-up requesting you to connect your wallet
//accounts will be an array
const accounts = await walletClient.requestAddresses();

//get the first address in the accounts array
const [address] = accounts;
console.log("address", address);

//Replace the following two values
//Make sure the MoodContractAddress is in double single/double quotes 
const MoodContractAddress = "0x1e3cCf0d60c2b124AB933C053676Dc8AA792E8c5";
const MoodContractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_mood",
				"type": "string"
			}
		],
		"name": "setMood",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMood",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const MoodContractInstance = getContract({
	address: MoodContractAddress,
	abi: MoodContractABI,
	client: walletClient,
});

getMood= async function() {
	//since getMood in our contract is a read function, your wallet won't pop up
	const mood = await MoodContractInstance.read.getMood();
	document.getElementById("showMood").innerText = `Your Mood: ${mood}`;
}

setMood= async function() {
	const mood = document.getElementById("mood").value;
	//setMood in our contract is a write function so your wallet will pop up and will ask you to confirm your transaction, requiring some gas fees.
	await MoodContractInstance.write.setMood([mood],{
		account:address
	});
}
