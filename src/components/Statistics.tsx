import React from 'react';
import { motion } from 'framer-motion';

interface StatProps {
  value: string;
  label: string;
  delay: number;
}

const Stat: React.FC<StatProps> = ({ value, label, delay }) => {
  return (
    <motion.div 
      className="text-center px-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{value}</div>
      <div className="text-gray-600 font-medium">{label}</div>
    </motion.div>
  );
};

const Statistics: React.FC = () => {
  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="flex flex-wrap justify-center gap-8 md:gap-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Stat value="5,000+" label="Dinners Hosted" delay={0.1} />
          <Stat value="25+" label="Cities" delay={0.2} />
          <Stat value="93%" label="Would Recommend" delay={0.3} />
          <Stat value="12,000+" label="New Friendships" delay={0.4} />
        </motion.div>
      </div>
    </section>
  );
};

export default Statistics;