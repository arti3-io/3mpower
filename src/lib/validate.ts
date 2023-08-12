import { BalanceType, TraitType, HoldDurationType } from '@/types/community';
import { Alchemy, Network } from 'alchemy-sdk';
import { fromHex, formatEther, hexToBigInt } from 'viem';
import { balanceValid } from '@/types/Validate';
import { env } from '@/env.mjs';

const config = {
  apiKey: env.ALCHEMY_KEY, // Replace with your API key
  network: Network.ETH_MAINNET, // Replace with your network
};
const alchemy = new Alchemy(config);

const balanceValidator = async (
  conditions: BalanceType,
  address: string
): Promise<balanceValid> => {
  try {
    switch (conditions.tokenStd) {
      case 'ERC20':
        const balance = await alchemy.core.getTokenBalances(
          address,
          conditions.contractAddr
        );
        const hexBal = balance.tokenBalances[0].tokenBalance; // hex string
        const decBal = formatEther(fromHex(`0x${hexBal?.slice(2)}`, 'bigint')); // decimal string
        return { pass: Number(decBal) >= conditions.amount };
      case 'ERC721':
        const nftBalance = await alchemy.nft.getNftsForOwner(address, {
          contractAddresses: conditions.contractAddr,
        });
        const tokenBal = nftBalance.totalCount;

        const tokenId = nftBalance.ownedNfts.find(
          (nft) => nft.tokenId !== undefined && nft.tokenId !== null
        )?.tokenId;

        return {
          pass: tokenBal >= conditions.amount,
          tokenId: tokenId,
        };
      case 'ERC1155':
        //not supported yet
        //TODO: implement ERC1155
        return { pass: false };

      default:
        throw new Error('Invalid token standard');
    }
  } catch (e) {
    console.log(e);
    return { pass: false };
  }
};

export const conditionsValidator = async (
  conditions: BalanceType | TraitType | HoldDurationType,
  address: string
) => {
  try {
    switch (conditions.type) {
      case 'balance':
        return await balanceValidator(conditions, address);
      case 'trait':
        throw new Error('Not supported yet');
      case 'hold_duration':
        throw new Error('Not supported yet');
      default:
        throw new Error('Invalid condition type');
    }
    // return alchemy.core.getTokenBalances(address, conditions.contractAddr)
  } catch (e) {
    console.log(e);
    return { pass: false };
  }
};
