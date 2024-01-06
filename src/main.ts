import { Transaction } from "@solana/web3.js";
import { SolanaWallet } from "./services";
import { Logger, DynamicQueue } from "./helpers";
import Mint from "./mint";

let MNEMONIC = process.env.MNEMONIC as string;
let COLLECTION_SYMBOL = process.env.COLLECTION_SYMBOL as string;
const logger = Logger.getInstance(__filename);

if (!MNEMONIC || !COLLECTION_SYMBOL) {
  logger.error({
    msg: "Environment variables MNEMONIC or COLLECTION_SYMBOL are not set",
    MNEMONIC,
    COLLECTION_SYMBOL,
  });
  process.exit(1);
}

const getTransactionTask = (mint: Mint) => async () => {
  const transaction = await mint.createTransaction(mint.magiceden);
  return mint.signTransaction(transaction);
};

const getSignedTransaction = async (mint: Mint): Promise<Transaction> => {
  return new Promise((resolve) => {
    new DynamicQueue(getTransactionTask(mint))
      .setConcurrency(1)
      .onSuccess((signedTransaction, taskId) => {
        logger.info({
          msg: `[${taskId}] Get signed transaction succeeded`,
          signedTransaction,
        });
        return resolve(signedTransaction);
      })
      .onFailure((_, taskId) => {
        logger.error({
          msg: `[${taskId}] Failed to get signed transaction`,
          taskId,
        });
      })
      .start();
  });
};

const mintNFT = async () => {
  const wallet = new SolanaWallet(MNEMONIC);

  const mint = await Mint.init({
    keypair: wallet.keypair,
    symbol: COLLECTION_SYMBOL,
  });

  const signedTransaction = await getSignedTransaction(mint);
  const transactionId = await mint.sendTransaction(signedTransaction);
  logger.info({
    msg: "Transaction successfully sent!",
    transactionId,
  });
};

mintNFT();
