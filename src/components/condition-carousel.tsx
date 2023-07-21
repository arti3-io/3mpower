'use client';

import {
  BalanceType,
  Community,
  HoldDurationType,
  TraitType,
} from '@/types/community';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getConditionTitleAndValue } from '@/lib/utils';

export function ConditionCarousel({ community }: { community: Community }) {
  const conditionsLength = community.conditions.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % conditionsLength);
    }, 3000);
    const { title, value } = getConditionTitleAndValue(
      community.conditions[currentIndex]
    );
    setTitle(title);
    setValue(value);
    return () => {
      clearInterval(interval);
    };
  }, [currentIndex]);

  return (
    <div className="relative overflow-hidden h-[40px]">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0 absolute"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5 }} // Transition duration for animations
        >
          {/* Display the current condition */}
          <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{title}</p>
            <p className="text-sm text-muted-foreground">{value}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
