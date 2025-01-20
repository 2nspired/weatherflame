'use client';

import { motion } from 'framer-motion';

export default function TypewriterText({
  text,
  className,
  speed = 0.1,
  cursor,
  timeDelay = 0,
}: {
  text: string;
  className?: string;
  speed?: number;
  cursor?: boolean;
  timeDelay?: number;
}): JSX.Element {
  const characters = text.split('');

  const characterVariants = {
    hidden: { opacity: 0, y: '100%' },
    visible: { opacity: 1, y: '0%' },
  };

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: speed, // delay between characters
        delayChildren: timeDelay, // delay before animation start
      },
    },
  };

  return (
    <div className={className}>
      <motion.div
        className="flex"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {characters.map((char, index) => (
          <motion.span key={index} variants={characterVariants}>
            {char}
          </motion.span>
        ))}
      </motion.div>
      {/* Optional blinking cursor */}
      {cursor && (
        <motion.span
          className="ml-1"
          initial={{ opacity: 1 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        >
          |
        </motion.span>
      )}
    </div>
  );
}
