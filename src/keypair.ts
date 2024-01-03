import * as web3 from "@solana/web3.js";
import { mnemonicToSeedSync } from "bip39";
import { HDKey } from "micro-ed25519-hdkey";

export class Keypair {
  private readonly DERIVATION_PATH: string = "m/44'/501'/0'/0'";
  public readonly keypair: web3.Keypair;
  private readonly connection: web3.Connection;

  constructor(mnemonic: string, DERIVATION_PATH?: string) {
    if (DERIVATION_PATH) {
      this.DERIVATION_PATH = DERIVATION_PATH;
    }
    this.keypair = this.recoverFromMnemonic(mnemonic);
    this.connection = new web3.Connection(
      web3.clusterApiUrl("mainnet-beta"),
      "confirmed",
    );
  }

  public get address(): string {
    return this.keypair.publicKey.toString();
  }

  public async getBalance(): Promise<number> {
    const balance = await this.connection.getBalance(this.keypair.publicKey);
    return balance / web3.LAMPORTS_PER_SOL;
  }

  public recoverFromMnemonic(mnemonic: string): web3.Keypair {
    const seed = mnemonicToSeedSync(mnemonic, "");
    const hd = HDKey.fromMasterSeed(seed.toString("hex"));
    return web3.Keypair.fromSeed(hd.derive(this.DERIVATION_PATH).privateKey);
  }
}
