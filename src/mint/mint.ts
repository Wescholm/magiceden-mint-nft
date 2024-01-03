import * as bs58 from "bs58";
import * as anchor from "@coral-xyz/anchor";
import {
  PublicKey,
  Transaction,
  SYSVAR_SLOT_HASHES_PUBKEY,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import MintAssistant from "./mint-assistant";
import { TOKEN_METADATA_PROGRAM_ID } from "../constants";
import { MintixAccounts, MintixParams, MintParams } from "../types";
import { Magiceden } from "../magiceden";

export class Mint extends MintAssistant {
  private constructor(params: MintParams) {
    super(params);
  }

  public static async init(params: MintParams): Promise<Mint> {
    const assistant = await super.init(params);
    return new Mint({
      ...params,
      magiceden: assistant.magiceden,
      candyMachineState: assistant.candyMachine,
    });
  }

  public async createTransaction(magiceden: Magiceden): Promise<Transaction> {
    const [accounts, params] = await Promise.all([
      this.generateAccounts(),
      this.generateParams(),
    ]);

    const { tx } = await magiceden.mintix(accounts, params);
    return Transaction.from(bs58.decode(tx));
  }

  public signTransaction(transaction: Transaction): Transaction {
    transaction.partialSign(this.payerKeyPair);
    transaction.partialSign(this.mintKeyPair);
    return transaction;
  }

  public async sendTransaction(transaction: Transaction): Promise<string> {
    const sendTx = transaction.serialize({ verifySignatures: true });
    return this.candyMachine.connection.sendRawTransaction(sendTx, {
      preflightCommitment: "processed",
    });
  }

  private async generateParams(): Promise<MintixParams> {
    const { blockhash } = await this.getLatestBlockhash();

    return {
      walletLimitInfoBump: this.walletLimitInfo[1],
      inOrder: false,
      blockhash: blockhash,
      needsNotary: true,
      isLite: false,
    };
  }

  private async generateAccounts(): Promise<MintixAccounts> {
    const [payTo, associatedTokenAccount] = await Promise.all([
      this.getPayTo(),
      this.getAssociatedTokenPubKey(),
    ]);

    return {
      config: this.candyMachine.state.config,
      candyMachine: new PublicKey(this.candyMachine.id),
      launchStagesInfo: this.launchStagesInfoPubKey,
      candyMachineWalletAuthority: this.candyMachine.state.walletAuthority,
      mintReceiver: this.payerPubKey,
      payer: this.payerPubKey,
      payTo: payTo,
      payFrom: this.payerPubKey,
      mint: this.mintPubKey,
      tokenAta: associatedTokenAccount,
      metadata: this.metadataPubKey,
      masterEdition: this.masterEditionPubKey,
      walletLimitInfo: this.walletLimitInfo[0],
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      orderInfo: this.candyMachine.state.orderInfo,
      slotHashes: SYSVAR_SLOT_HASHES_PUBKEY,
      notary: this.candyMachine.state.notary,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    };
  }
}
