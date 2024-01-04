import SolanaWallet from "./solana-wallet";
import Mint from "./mint";
import { Logger } from "./helpers";

const MNEMONIC = process.env.MNEMONIC as string;
const COLLECTION_SYMBOL = process.env.COLLECTION_SYMBOL as string;
const logger = Logger.getInstance(__filename);

const mintNFT = async () => {
  const wallet = new SolanaWallet(MNEMONIC);

  const mint = await Mint.init({
    keypair: wallet.keypair,
    symbol: COLLECTION_SYMBOL,
  });

  try {
    const transaction = await mint.createTransaction(mint.magiceden);
    const signedTransaction = mint.signTransaction(transaction);
    const txId = await mint.sendTransaction(signedTransaction);
    logger.info({
      msg: "NFT successfully minted!",
      txId,
    });
  } catch (error) {
    logger.fatal({
      msg: "Failed to mint NFT",
      error,
    });
    process.exit(1);
  }

  process.exit(0);
};

mintNFT();
