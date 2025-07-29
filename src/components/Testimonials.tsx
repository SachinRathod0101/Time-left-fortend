import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TestimonialProps {
  quote: string;
  name: string;
  location: string;
  image: string;
}

const testimonials: TestimonialProps[] = [
  {
    quote: "TimeLeft dinners have completely changed how I meet new people. The conversations are so much deeper than typical social events.",
    name: "Sarah J.",
    location: "New York",
    image: "https://via.placeholder.com/80",
  },
  {
    quote: "I was skeptical at first, but after my first dinner I was hooked. I've made genuine friends that I still meet up with regularly.",
    name: "Michael T.",
    location: "London",
    image: "https://via.placeholder.com/80",
  },
  {
    quote: "As someone who moved to a new city, TimeLeft was the perfect way to build a social circle with people who share my interests.",
    name: "Emma L.",
    location: "Berlin",
    image: "https://via.placeholder.com/80",
  },
  {
    quote: "The conversation starter games make it so easy to break the ice. No awkward silences, just great conversations!",
    name: "David K.",
    location: "Paris",
    image: "https://via.placeholder.com/80",
  },
];

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            What Our Guests Say
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Real stories from people who've experienced our dinners
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-background rounded-2xl p-8 md:p-10 shadow-lg relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Quote icon */}
            <div className="absolute top-6 left-6 text-primary/20 text-6xl font-serif">"</div>
            
            <div className="relative z-10">
              <p className="text-lg md:text-xl italic text-gray-700 mb-6">
                {testimonials[activeIndex].quote}
              </p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonials[activeIndex].image} 
                    alt={testimonials[activeIndex].name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">{testimonials[activeIndex].name}</h4>
                  <p className="text-gray-600">{testimonials[activeIndex].location}</p>
                </div>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="absolute bottom-6 right-6 flex space-x-2">
              <button 
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Previous testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Next testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
          
          {/* Testimonial indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${index === activeIndex ? 'bg-primary' : 'bg-gray-300'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;