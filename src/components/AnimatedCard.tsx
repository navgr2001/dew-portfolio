import { PropsWithChildren } from 'react';
import { motion } from 'motion/react';

type AnimatedCardProps = PropsWithChildren<{
  className?: string;
  delay?: number;
}>;

export function AnimatedCard({ children, className = '', delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.01 }}
      className={`glass-panel ${className}`}
    >
      {children}
    </motion.div>
  );
}
