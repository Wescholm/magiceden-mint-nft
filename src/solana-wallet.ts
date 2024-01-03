import {
  Keypair,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { mnemonicToSeedSync } from "bip39";
import { HDKey } from "micro-ed25519-hdkey";
import { Logger } from "./helpers";
import { DEFAULT_DERIVATION_PATH } from "./constants";

export default class SolanaWallet {
  private readonly DERIVATION_PATH: string;
  public readonly keypair: Keypair;
  private readonly connection: Connection;
  private readonly logger = new Logger(__filename);

  constructor(mnemonic: string, DERIVATION_PATH?: string) {
    this.DERIVATION_PATH = DERIVATION_PATH || DEFAULT_DERIVATION_PATH;

    this.keypair = this.recoverFromMnemonic(mnemonic);
    this.connection = new Connection(
      clusterApiUrl("mainnet-beta"),
      "confirmed",
    );
  }

  public get address(): string {
    return this.keypair.publicKey.toString();
  }

  public async getBalance(): Promise<number> {
    const balance = await this.connection.getBalance(this.keypair.publicKey);
    return balance / LAMPORTS_PER_SOL;
  }

  public recoverFromMnemonic(mnemonic: string): Keypair {
    this.logger.debug(`Recovering keypair from mnemonic: ${mnemonic}`);
    try {
      const seed = mnemonicToSeedSync(mnemonic, "");
      const hd = HDKey.fromMasterSeed(seed.toString("hex"));
      const keypair = Keypair.fromSeed(
        hd.derive(this.DERIVATION_PATH).privateKey,
      );

      this.logger.info(
        `Recovered keypair from mnemonic. Address: ${keypair.publicKey.toString()}`,
      );

      return keypair;
    } catch (error) {
      this.logger.fatal("Failed to recover keypair from mnemonic", error);
      process.exit(1);
    }
  }
}
