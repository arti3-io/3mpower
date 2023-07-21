'use client';

import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

export default function SplineArt() {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 0, x: 0 }} // Initial animation properties
      whileInView={{ opacity: 1 }} // Animation properties to animate to
      transition={{ duration: 1, delay: 0.25 }}
    >
      <Spline scene="https://prod.spline.design/osglOdF65YXc2rZm/scene.splinecode" />
    </motion.div>
  );
}
