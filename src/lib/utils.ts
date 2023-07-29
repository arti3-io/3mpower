import { BalanceType, HoldDurationType, TraitType } from '@/types/community';
import { type ClassValue, clsx } from 'clsx';
import { E } from 'drizzle-orm/column.d-aa4e525d';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const tap = async <T>(
  value: T,
  cb: (value: T) => Promise<unknown>
): Promise<T> => {
  await cb(value);
  return value;
};

export function truncatedAddr(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

export function formatNumber(value: number | string) {
  const number = typeof value === 'string' ? parseInt(value) : value;
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'k';
  } else {
    return number.toString();
  }
}

export const getConditionTitleAndValue = (
  condition: BalanceType | TraitType | HoldDurationType
) => {
  switch (condition.type) {
    case 'balance':
      return {
        title: 'Token Gated',
        value: `Hold at least ${condition.amount} token`,
      };
    case 'trait':
      return {
        title: 'Trait Gated',
        value: condition.traits
          .map((trait) => `${trait.trait_type}:${trait.value}`)
          .join(', '),
      };
    case 'hold_duration':
      return {
        title: 'Held since',
        value: `${new Date(condition.timestamp * 1000).toLocaleDateString()}`,
      };
    default:
      return {
        title: '',
        value: '',
      };
  }
};

// truncate text to 280 characters
export const truncate = (length: number, text?: string) => {
  if (!text) {
    return '';
  }
  if (text.length <= length) {
    return text;
  }
  return text.slice(0, length) + '...';
};
