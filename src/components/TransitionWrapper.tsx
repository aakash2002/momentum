'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export default function TransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1], // Smooth cubic
      }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}
