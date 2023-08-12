export type Community = {
  id: string;
  name: string;
  contractAddr?: string;
  list: string;
  banner_url: string;
  profile_url: string;
  requireTwiiterFollow: string[];
  conditions: (BalanceType | TraitType | HoldDurationType)[];
  events: CommunityEvent[];
};

export type CommunityEvent = {
  id: string;
  title: string;
  hashtags: string[];
  date: {
    from: string;
    to: string;
  };
};

export type BalanceType = {
  type: 'balance';
  tokenStd: 'ERC20' | 'ERC721' | 'ERC1155';
  contractAddr: string[];
  amount: number;
};

export type TraitType = {
  type: 'trait';
  operator: 'and';
  traits: { trait_type: string; value: string }[];
};

export type HoldDurationType = {
  type: 'hold_duration';
  timestamp: number;
};
