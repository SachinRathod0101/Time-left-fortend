import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import img from '../360_F_111979999_w5g38xgRifYlDuaYp1dUtPlOSWlRKOc6.jpg'

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-background pt-16">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div 
            className="md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight mb-6">
              Make new friends <br />
              <span className="text-primary">in real life</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
              Join our community dinners and connect with like-minded people in your city. No awkward small talk, just meaningful conversations.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/events"
                className="inline-block bg-primary text-white text-lg font-medium px-8 py-4 rounded-full hover:bg-primary/90 transition-colors duration-300 shadow-lg"
              >
                Book a Dinner
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              {/* Placeholder for hero image */}
              <div className="w-full h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-xl">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-gray-400">
                  <img src={img} alt="" />

                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent rounded-full opacity-70"></div>
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-secondary rounded-full opacity-70"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;