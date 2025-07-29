import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CTA: React.FC = () => {
  return (
    <section id="book" className="py-20 bg-primary/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Ready to Make New Friends Over Dinner?
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Join our next dinner event and connect with interesting people in your city. No awkward small talk, just meaningful conversations.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/events"
                className="inline-block bg-primary text-white text-lg font-medium px-10 py-4 rounded-full hover:bg-primary/90 transition-colors duration-300 shadow-lg"
              >
                Book a Dinner
              </Link>
            </motion.div>
            
            <p className="mt-4 text-gray-500 text-sm">
              Dinners are held every Wednesday in select cities.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;