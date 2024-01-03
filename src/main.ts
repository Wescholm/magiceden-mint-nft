import "dotenv/config";
import SolanaWallet from "./solana-wallet";
import Mint from "./mint";
import { Logger } from "./helpers";

const logger = new Logger(__filename);
declare var process: {
  exit(code?: number): never;
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

  try {
    const transaction = await mint.createTransaction(mint.magiceden);
    const signedTransaction = mint.signTransaction(transaction);
    const txId = await mint.sendTransaction(signedTransaction);
    logger.info(`Transaction successfully sent! TxId: ${txId}`);
  } catch (e) {
    logger.fatal("Failed to mint NFT", e);
    process.exit(1);
  }
};

mintNFT();
