import * as anchor from "@coral-xyz/anchor";
import {
  PublicKey,
  Keypair,
  BlockhashWithExpiryBlockHeight,
} from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { CandyMachine } from "./candy-machine";
import { MintParams, CandyMachineState } from "../types";
import {
  CANDY_MACHINE_PROGRAM_V1,
  TOKEN_METADATA_PROGRAM_ID,
} from "../constants";
import { Magiceden } from "../magiceden";

export default class MintAssistant {
  public readonly magiceden: Magiceden;
  public readonly candyMachine: CandyMachineState;

  protected readonly mintKeyPair: Keypair;
  protected readonly payerKeyPair: Keypair;

  protected readonly payerPubKey: PublicKey;
  protected readonly mintPubKey: PublicKey;

  constructor(params: MintParams) {
    this.payerKeyPair = params.keypair;
    this.mintKeyPair = Keypair.generate();

    this.payerPubKey = params.keypair.publicKey;
    this.mintPubKey = this.mintKeyPair.publicKey;

    this.magiceden = params.magiceden!;
    this.candyMachine = params.candyMachineState!;
  }

  public static async init(params: MintParams): Promise<MintAssistant> {
    const magiceden = await Magiceden.init(params.symbol);
    const candyMachine = new CandyMachine(params.keypair);

    const candyMachineState = await candyMachine.fetchCandyMachineData(
      magiceden.collection.candyMachineId,
    );

    return new MintAssistant({
      ...params,
      magiceden,
      candyMachineState,
    });
  }

  protected async getLatestBlockhash(): Promise<BlockhashWithExpiryBlockHeight> {
    return this.candyMachine.connection.getLatestBlockhash("finalized");
  }

  protected get launchStagesInfoPubKey(): PublicKey {
    const [launchStagesInfo, launchStagesBump] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [
          anchor.utils.bytes.utf8.encode("candy_machine"),
          anchor.utils.bytes.utf8.encode("launch_stages"),
          this.candyMachine.publicKey.toBuffer(),
        ],
        CANDY_MACHINE_PROGRAM_V1,
      );
    return launchStagesInfo;
  }

  protected get walletLimitInfo(): [PublicKey, number] {
    return anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("wallet_limit"),
        this.candyMachine.publicKey.toBuffer(),
        this.payerPubKey.toBuffer(),
      ],
      CANDY_MACHINE_PROGRAM_V1,
    );
  }

  protected async getPayTo(): Promise<PublicKey> {
    return anchor.utils.token.associatedAddress({
      mint: this.mintPubKey,
      owner: this.candyMachine.state.walletAuthority,
    });
  }

  protected get tokenPubKey(): PublicKey {
    const [token] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        this.payerPubKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        this.mintKeyPair.publicKey.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );
    return token;
  }

  protected get metadataPubKey(): PublicKey {
    const [metadata] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        this.mintKeyPair.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    );
    return metadata;
  }

  protected get masterEditionPubKey(): PublicKey {
    const [masterEdition] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        this.mintKeyPair.publicKey.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    );
    return masterEdition;
  }

  protected async getAssociatedTokenPubKey(): Promise<PublicKey> {
    return await getAssociatedTokenAddress(
      this.mintKeyPair.publicKey,
      this.payerPubKey,
    );
  }
}
