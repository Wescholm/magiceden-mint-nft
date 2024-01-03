import "dotenv/config";
import { Keypair } from "./src/keypair";
import { Mint } from "./src/mint";

const mintNFT = async () => {
  const wallet = new Keypair(process.env.MNEMONIC);

  const mint = await Mint.init({
    keypair: wallet.keypair,
    symbol: process.env.COLLECTION_SYMBOL,
  });

  const transaction = await mint.createTransaction(mint.magiceden);
  const signedTransaction = mint.signTransaction(transaction);
  const txId = await mint.sendTransaction(signedTransaction);
};

mintNFT();
