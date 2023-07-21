'use client';
import { motion } from 'framer-motion';

export default function ShowCase() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 0, x: 200 }}
        whileInView={{ opacity: 1, rotateZ: -5, scale: 1.25 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ width: '50%' }} // Add a width style to limit the container width
      >
        <img
          src="/landing/list-1.png"
          className="w-full absolute" // Change w-1/2 to w-full
          alt="list-2"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 0, x: 0 }}
        whileInView={{ opacity: 1, y: 150, x: 70, rotateZ: 5, scale: 1.25 }}
        transition={{ duration: 1, delay: 0.25 }}
        style={{ width: '50%' }} // Add a width style to limit the container width
      >
        <img
          src="/landing/list-2.png"
          className="w-full absolute" // Change w-1/2 to w-full
          alt="list-1"
        />
      </motion.div>
    </>
  );
}
