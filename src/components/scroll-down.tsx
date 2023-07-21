'use client';
import { motion } from 'framer-motion';
import { Icons } from './icons';

export default function ScrollDownIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { duration: 1, delay: 0.5 },
      }}
    >
      <Icons.chevronsDown className="w-8 h-8 text-gray-500 absolute bottom-4" />
    </motion.div>
  );
}
