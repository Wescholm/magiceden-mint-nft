export interface CollectionDetailsResponseEntity {
  _id: string;
  name: string;
  symbol: string;
  image: string;
  description: string;
  price: number;
  size: number;
  prelaunch: {
    whitelist: boolean;
  };
  launchDate: string;
  featured: boolean;
  published: boolean;
  crossmintId: string;
  finished: boolean;
  mint: {
    candyMachineId: string;
  };
  createdAt: string;
  discordLink: string;
  websiteLink: string;
  twitterLink: string;
  polkastarterLink: string;
  disableAutolist: boolean;
  externalLink: string;
  externalLinkCTA: string;
  placeholderStages: any[];
  presaleAmountOffset: number;
  isClaim: boolean;
  isMarketingOnly: boolean;
  sol: {
    openEdition: boolean;
  };
  blockchain: string;
  collectEmail: boolean;
  collectionSymbol: string;
  contractType: string;
  endDate: any;
  featuredCarouselIndex: number;
  featuredMediaUrl: string;
  featuredMediaUrlGif: boolean;
  hideMakeOfferButton: boolean;
  hideMintedProgressBar: boolean;
  hidePrice: boolean;
  hideTotalSupply: boolean;
  hideViewCollectionButton: boolean;
  hideWhitelistSize: boolean;
  imageGif: boolean;
  isFrozen: boolean;
  mediaAutoAspect: boolean;
  mintAllocationDisclaimerCount: any;
  richDescription: string;
  richPeople: string;
  richRoadmap: string;
  roadmapList: any[];
  state: {
    candyMachine: string;
    itemsAvailable: number;
    itemsRedeemed: number;
    itemsRedeemedNormal: number;
    itemsRedeemedRaffle: number;
    itemsRemaining: number;
    raffleTicketsPurchased: number;
    stages: Array<{
      price: number;
      startTime: string;
      walletLimit: {
        noLimit: {};
      };
      endTime: string;
      type: string;
      mintedDuringStage: number;
      previousStageUnmintedSupply: number;
    }>;
    goLiveDate: string;
  };
  teamList: any[];
  updatedAt: string;
  whitepaperLink: string;
}

type CollectionDetailsResponse = Array<CollectionDetailsResponseEntity>;

export { CollectionDetailsResponse };
