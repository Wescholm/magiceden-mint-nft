import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  clusterApiUrl,
} from "@solana/web3.js";
import { AnchorProvider, Wallet, Program } from "@coral-xyz/anchor";
import { CandyMachineState } from "../types";
import { Logger } from "../helpers";
import { CANDY_MACHINE_PROGRAM_V1 } from "../constants";

export class CandyMachine {
  private readonly provider: AnchorProvider;
  private readonly logger = new Logger(__filename);

  constructor(keypair: Keypair) {
    const connection = new Connection(
      clusterApiUrl("mainnet-beta"),
      "confirmed",
    );
    this.provider = new AnchorProvider(connection, new Wallet(keypair), {
      preflightCommitment: "recent",
    });
  }

  public readonly fetchCandyMachineData = async (
    candyMachineId: string,
  ): Promise<CandyMachineState> => {
    const idl = await Program.fetchIdl(CANDY_MACHINE_PROGRAM_V1, this.provider);

    if (!idl) {
      throw new Error("Candy Machine program IDL not found");
    }

    const program = new Program(idl, CANDY_MACHINE_PROGRAM_V1, this.provider);
    const state = await program.account.candyMachine.fetch(candyMachineId);
    const notary = state.notary as PublicKey;

    const itemsAvailable = +state.itemsAvailable!;
    const itemsRedeemed = +state.itemsRedeemedNormal!;
    const itemsRemaining = itemsAvailable - itemsRedeemed;

    this.logger.info(
      `Found candy machine "${candyMachineId}" with ${itemsRemaining} items available`,
    );

    return {
      id: candyMachineId,
      publicKey: new PublicKey(candyMachineId),
      connection: this.provider.connection,
      program,
      state: {
        config: state.config as PublicKey,
        notary: notary ?? SystemProgram.programId,
        orderInfo: state.orderInfo as PublicKey,
        itemsAvailable,
        itemsRedeemed,
        itemsRemaining,
        itemsRedeemedRaffle: +state.itemsRedeemedRaffle!,
        isSoldOut: itemsRemaining === 0,
        walletAuthority: state.walletAuthority as PublicKey,
      },
    };
  };
}
