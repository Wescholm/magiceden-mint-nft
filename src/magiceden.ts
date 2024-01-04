import { CurlImpersonate, Logger } from "./helpers";
import {
  MAGICEDEN_BASE_API_URL,
  MAGICEDEN_MINTIX_URL,
  MAGICEDEN_NOTARY_HOST,
  MAGICEDEN_URL,
} from "./constants";
import {
  CollectionDetailsResponse,
  CollectionDetails,
  MintixAccounts,
  MintixParams,
  MintixResponse,
} from "./types";

export class Magiceden {
  public readonly collection: CollectionDetails;
  private readonly logger = Logger.getInstance(__filename);

  private constructor(collection?: CollectionDetails) {
    this.collection = collection!;
  }

  public static async init(symbol: string): Promise<Magiceden> {
    const collection = await this.getCollectionDetails(symbol);
    return new Magiceden(collection);
  }

  public async mintix(
    accounts: MintixAccounts,
    params: MintixParams,
  ): Promise<MintixResponse> {
    const curl = new CurlImpersonate();
    try {
      const response = await curl.post(
        MAGICEDEN_MINTIX_URL,
        {
          params: params,
          accounts: accounts,
        },
        {
          authority: MAGICEDEN_NOTARY_HOST,
          origin: MAGICEDEN_URL,
          referer: MAGICEDEN_URL,
        },
      );
      return JSON.parse(response);
    } catch (error) {
      this.logger.error({
        msg: "Failed to send mintix request to MagicEden",
        error,
      });
      throw error;
    }
  }

  private static async getCollectionDetails(
    symbol: string,
  ): Promise<CollectionDetails> {
    const curl = new CurlImpersonate();
    const requestUrl = `${MAGICEDEN_BASE_API_URL}/launchpad_collections`;

    const response = await curl.get(requestUrl);
    const data: CollectionDetailsResponse = JSON.parse(response);

    const collection = data.find((collection) => collection.symbol === symbol);
    if (!collection) {
      throw new Error("Collection not found");
    }

    return {
      symbol: collection.symbol,
      name: collection.name,
      candyMachineId: collection.mint.candyMachineId,
    };
  }
}
