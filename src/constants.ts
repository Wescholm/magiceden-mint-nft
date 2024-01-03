import { PublicKey } from "@solana/web3.js";

const MAGICEDEN_URL = "https://magiceden.io";
const MAGICEDEN_BASE_API_URL = "https://api-mainnet.magiceden.io";
const MAGICEDEN_NOTARY_HOST = "wk-notary-prod.magiceden.io";
const MAGICEDEN_MINTIX_URL = "https://wk-notary-prod.magiceden.io/mintix";

const CANDY_MACHINE_PROGRAM_V1 = new PublicKey(
  "CMZYPASGWeTz7RNGHaRJfCq2XQ5pYK6nDvVQxzkH51zb",
);

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
);

export {
  CANDY_MACHINE_PROGRAM_V1,
  TOKEN_METADATA_PROGRAM_ID,
  MAGICEDEN_URL,
  MAGICEDEN_BASE_API_URL,
  MAGICEDEN_NOTARY_HOST,
  MAGICEDEN_MINTIX_URL,
};
