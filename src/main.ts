import "dotenv/config";
import SolanaWallet from "./solana-wallet";
import Mint from "./mint";

declare var process: {
  env: {
    MNEMONIC: string;
    COLLECTION_SYMBOL: string;
  };
};

const mintNFT = async () => {
  const wallet = new SolanaWallet(process.env.MNEMONIC);

  const mint = await Mint.init({
    keypair: wallet.keypair,
    symbol: process.env.COLLECTION_SYMBOL,
  });

  const transaction = await mint.createTransaction(mint.magiceden);
  const signedTransaction = mint.signTransaction(transaction);
  const txId = await mint.sendTransaction(signedTransaction);
};

const wallet = new SolanaWallet(process.env.MNEMONIC);
wallet.address;

// mintNFT();
