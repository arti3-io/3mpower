'use client';

import { Community } from '@/types/community';
import { motion } from 'framer-motion';
import { CollectionDialogue } from './collection-dialogue';
import { Icons } from './icons';

export default function FeaturedCollections({
  communities,
}: {
  communities: Community[];
}) {
  return (
    <div className="flex gap-4 items-center mb-4 md:justify-center lg:justify-normal">
      {communities[0] && (
        <motion.div
          initial={{ opacity: 0, y: -25, x: 100 }} // Initial animation properties
          whileInView={{ opacity: 1, x: 0, y: 0 }} // Animation properties to animate to
          transition={{ duration: 1, delay: 0.25 }}
          style={{
            cursor: 'pointer',
          }}
        >
          <motion.div
            initial={{ y: 0 }}
            transition={{
              duration: 0.25,
              type: 'spring',
              stiffness: 500,
            }}
            whileHover={{ y: -10 }}
          >
            <CollectionDialogue community={communities[0]}>
              <img
                src={communities[0].profile_url}
                className="w-12 h-12 rounded-lg top-4 left-2 border"
              />
            </CollectionDialogue>
          </motion.div>
        </motion.div>
      )}
      {communities[1] && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: 100 }} // Initial animation properties
          whileInView={{ opacity: 1, x: 0, y: 0 }} // Animation properties to animate to
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            cursor: 'pointer',
          }}
        >
          <motion.div
            initial={{ y: 0 }}
            transition={{
              duration: 0.25,
              type: 'spring',
              stiffness: 500,
            }}
            whileHover={{ y: -10 }}
          >
            <CollectionDialogue community={communities[1]}>
              <img
                src={communities[1].profile_url}
                className="w-12 h-12 rounded-lg top-4 left-2 border"
              />
            </CollectionDialogue>
          </motion.div>
        </motion.div>
      )}
      {communities[2] && (
        <motion.div
          initial={{ opacity: 0, y: -75, x: 100 }} // Initial animation properties
          whileInView={{ opacity: 1, x: 0, y: 0 }} // Animation properties to animate to
          transition={{ duration: 1, delay: 0.75 }}
          style={{
            cursor: 'pointer',
          }}
        >
          <motion.div
            initial={{ y: 0 }}
            transition={{
              duration: 0.25,
              type: 'spring',
              stiffness: 500,
            }}
            whileHover={{ y: -10 }}
          >
            <CollectionDialogue community={communities[2]}>
              <img
                src={communities[2].profile_url}
                className="w-12 h-12 rounded-lg top-4 left-2 border"
              />
            </CollectionDialogue>
          </motion.div>
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, x: 100 }} // Initial animation properties
        whileInView={{ opacity: 1, x: [100, -10, 0] }} // Animation properties to animate to
        transition={{ duration: 1, delay: 1.25 }}
      >
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Icons.arrowLeft /> Featured
        </div>
      </motion.div>
    </div>
  );
}
