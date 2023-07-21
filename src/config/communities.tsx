import { Community } from '@/types/community';

export const communities: Community[] = [
  {
    id: 'mazkgang',
    name: 'Mazk Gang',
    contractAddr: '0xfa3c785b3f9e6140a9d058976d85bbb9bdd704b0',
    list: '1677692605482815489',
    banner_url:
      'https://i.seadn.io/gcs/files/cdecc2857d452866eeebc87d96a7e33d.jpg?auto=format&dpr=1&w=1920',
    profile_url:
      'https://i.seadn.io/gcs/files/9a3eca819213540351ae773d384d4383.gif?auto=format&dpr=1&w=256',
    requireTwiiterFollow: ['Mazkgang'],
    conditions: [
      {
        type: 'balance',
        tokenStd: 'ERC721',
        contractAddr: '0xfa3c785b3f9e6140a9d058976d85bbb9bdd704b0',
        amount: 1,
      },
    ],
    events: [],
  },
  {
    id: '0n1force',
    name: '0N1 Force',
    contractAddr: '0x3bf2922f4520a8ba0c2efc3d2a1539678dad5e9d',
    list: '1677692164376248321',
    banner_url:
      'https://i.seadn.io/gcs/files/7c09241857d176d479e2fdab337d4304.png?auto=format&dpr=1&w=1920',
    profile_url:
      'https://i.seadn.io/gae/7gOej3SUvqALR-qkqL_ApAt97SpUKQOZQe88p8jPjeiDDcqITesbAdsLcWlsIg8oh7SRrTpUPfPlm12lb4xDahgP2h32pQQYCsuOM_s?auto=format&dpr=1&w=256',
    events: [
      {
        id: '0n1forcesdcc2023',
        title: '0N1 Force SDCC 2023',
        hashtags: ['#SDCC2023'],
        date: {
          from: '2023-07-01',
          to: '2023-07-09',
        },
      },
    ],
    requireTwiiterFollow: ['3MPOWER_XYZ'],
    conditions: [
      {
        type: 'balance',
        tokenStd: 'ERC721',
        contractAddr: '0x3bf2922f4520a8ba0c2efc3d2a1539678dad5e9d',
        amount: 1,
      },
      {
        type: 'trait',
        operator: 'and',
        traits: [
          {
            trait_type: 'WEAR',
            value: 'Thermal Hoodie',
          },
        ],
      },
      {
        type: 'hold_duration',
        timestamp: 1689257169,
      },
    ],
  },
];
