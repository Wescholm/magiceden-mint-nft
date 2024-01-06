import * as anchor from "@coral-xyz/anchor";
import { Keypair, PublicKey, Connection, Transaction } from "@solana/web3.js";
import { Magiceden } from "../services";

type CollectionDetails = {
  symbol: string;
  name: string;
  candyMachineId: string;
};

type MintParams = {
  keypair: Keypair;
  symbol: string;
  magiceden?: Magiceden;
  candyMachineState?: CandyMachineState;
};

type CandyMachineState = {
  id: string;
  publicKey: PublicKey;
  program: anchor.Program;
  connection: Connection;
  state: {
    config: PublicKey;
    notary: PublicKey;
    walletAuthority: PublicKey;
    orderInfo: PublicKey;
    itemsAvailable: number;
    itemsRedeemed: number;
    itemsRemaining: number;
    itemsRedeemedRaffle: number;
    isSoldOut: boolean;
  };
};

type MintixAccounts = {
  config: PublicKey;
  candyMachine: PublicKey;
  launchStagesInfo: PublicKey;
  candyMachineWalletAuthority: PublicKey;
  mintReceiver: PublicKey;
  payer: PublicKey;
  payTo: PublicKey;
  payFrom: PublicKey;
  mint: PublicKey;
  tokenAta: PublicKey;
  metadata: PublicKey;
  masterEdition: PublicKey;
  walletLimitInfo: PublicKey;
  tokenMetadataProgram: PublicKey;
  tokenProgram: PublicKey;
  systemProgram: PublicKey;
  rent: PublicKey;
  orderInfo: PublicKey;
  slotHashes: PublicKey;
  notary: PublicKey;
  associatedTokenProgram: PublicKey;
};

type MintixParams = {
  walletLimitInfoBump: number;
  inOrder: boolean;
  blockhash: string;
  needsNotary: boolean;
  isLite: boolean;
};

type MintixResponse = {
  tx: string;
};

type AsyncTask<T = Transaction> = () => Promise<T>;
type SuccessCallback = (response: any, taskId: number) => void;
type FailureCallback = (error: any, taskId: number) => void;

interface TaskState {
  id: number;
  execute: AsyncTask<Transaction>;
}

export {
  CollectionDetails,
  MintParams,
  MintixParams,
  MintixAccounts,
  MintixResponse,
  CandyMachineState,
  AsyncTask,
  SuccessCallback,
  FailureCallback,
  TaskState,
};
