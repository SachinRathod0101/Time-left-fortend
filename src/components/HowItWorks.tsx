import React from 'react';
import { motion } from 'framer-motion';

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

const Step: React.FC<StepProps> = ({ number, title, description, icon, delay }) => {
  return (
    <motion.div 
      className="flex flex-col items-center text-center max-w-xs mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative">
        <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
          {number}
        </span>
        <div className="text-primary text-3xl">{icon}</div>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Join a dinner in three simple steps and make meaningful connections
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
          <Step 
            number={1} 
            title="Sign Up" 
            description="Create your profile and complete our personality questionnaire to help us match you with like-minded people."
            icon={<span>👤</span>}
            delay={0.2}
          />
          
          <Step 
            number={2} 
            title="Book a Dinner" 
            description="Choose from available dinners in your city and secure your spot at the table with other interesting people."
            icon={<span>🍽️</span>}
            delay={0.3}
          />
          
          <Step 
            number={3} 
            title="Enjoy the Experience" 
            description="Show up at the restaurant, meet new people, and enjoy meaningful conversations over a delicious meal."
            icon={<span>🎉</span>}
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;