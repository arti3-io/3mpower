export interface ContractMetadata {
  name: string;
  symbol: string;
  totalSupply: string;
  tokenType: string;
  contractDeployer: string;
  deployedBlockNumber: number;
  openSea: {
    floorPrice: number;
    collectionName: string;
    safelistRequestStatus: string;
    imageUrl: string;
    description: string;
    externalUrl: string;
    twitterUsername: string;
    discordUrl: string;
    lastIngestedAt: string;
  };
}

export interface FloorPrice {
  openSea: {
    floorPrice: number;
    priceCurrency: string;
    collectionUrl: string;
    retrievedAt: string;
  };
  looksRare: {
    floorPrice: number;
    priceCurrency: string;
    collectionUrl: string;
    retrievedAt: string;
  };
}
