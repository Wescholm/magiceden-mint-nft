import Mint from "./mint";
import SolanaWallet from "./solana-wallet";
import { Logger, DynamicQueue } from "./helpers";

const MNEMONIC = process.env.MNEMONIC as string;
const COLLECTION_SYMBOL = process.env.COLLECTION_SYMBOL as string;
const logger = Logger.getInstance(__filename);

if (!MNEMONIC || !COLLECTION_SYMBOL) {
  logger.error({
    msg: "Environment variables MNEMONIC or COLLECTION_SYMBOL are not set",
    MNEMONIC,
    COLLECTION_SYMBOL,
  });
  process.exit(1);
}

const mintNFT = async (mint: Mint): Promise<string> => {
  const transaction = await mint.createTransaction(mint.magiceden);
  const signedTransaction = mint.signTransaction(transaction);
  return await mint.sendTransaction(signedTransaction);
};

const main = async () => {
  const wallet = new SolanaWallet(MNEMONIC);

  const mint = await Mint.init({
    keypair: wallet.keypair,
    symbol: COLLECTION_SYMBOL,
  });

  const mintTask = (m: Mint) => async () => {
    return await mintNFT(m);
  };

  const queue = new DynamicQueue(mintTask(mint))
    .setConcurrency(1)
    .onSuccess((response, taskId) => {
      logger.info({
        msg: `[${taskId}] Task succeeded`,
        response,
      });
      process.exit(0);
    })
    .onFailure((_, taskId) => {
      logger.error({
        msg: `[${taskId}] Task failed`,
        taskId,
      });
    })
    .start();
};

main();
