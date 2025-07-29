import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { galleryItems, GalleryItem } from '../galleryData';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const FeaturedGallery: React.FC = () => {
  // Show first 4 images for the feature section
  const featuredImages = galleryItems.slice(0, 4);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Moments</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A glimpse into the connections and experiences created at our dinners.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredImages.map((item, index) => (
            <motion.div
              key={item.src}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="group relative overflow-hidden rounded-lg shadow-lg h-72"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end p-4">
                <h3 className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  {item.caption}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-12 text-center" viewport={{ once: true }}>
          <Link
            to="/gallery"
            className="inline-block bg-primary text-white text-lg font-medium px-10 py-4 rounded-full hover:bg-primary/90 transition-colors duration-300 shadow-lg"
          >
            View Full Gallery
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedGallery;