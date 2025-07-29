import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import GalleryImageSkeleton from '../components/GalleryImageSkeleton';
import { galleryItems, GalleryItem } from '../galleryData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const filterCategories = ['All', 'Food', 'People', 'Ambiance'];
const ITEMS_PER_PAGE = 8; // Number of items to show initially and load more

const GalleryPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Simulate image loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Adjust time as needed
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'All') {
      return galleryItems;
    }
    return galleryItems.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  // When the filter changes, reset the number of visible items
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activeFilter]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prevCount) => prevCount + 4); // Load 4 more items
  }, []);

  return (
    <motion.div
      className="container mx-auto px-4 py-12 pt-24" // Added pt-24 for navbar spacing
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Our Moments</h1>
        <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-12">
          A glimpse into the connections and experiences created at TimeLeft dinners. See the smiles, the conversations, and the delicious food that bring people together.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-16 rounded-lg overflow-hidden shadow-xl">
        <video
          className="w-full h-auto max-h-[600px] object-cover"
          src="https://videos.pexels.com/video-files/853898/853898-hd.mp4"
          autoPlay
          loop
          muted
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-center items-center space-x-2 sm:space-x-4 mb-12">
        {filterCategories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-4 py-2 text-sm sm:text-base rounded-full font-medium transition-colors duration-300 ${
              activeFilter === category
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <GalleryImageSkeleton key={index} />
          ))}
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {visibleItems.map((item) => (
              <motion.div
                layout
                key={item.src}
                layoutId={`card-${item.src}`}
                onClick={() => setSelectedItem(item)}
                className="group relative overflow-hidden rounded-lg shadow-lg h-72 cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <img src={item.src} alt={item.alt} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
                  <h3 className="text-white text-lg font-semibold">{item.caption}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      
      {!isLoading && visibleCount < filteredItems.length && (
        <motion.div
          variants={itemVariants}
          className="mt-12 text-center"
        >
          <button
            onClick={handleLoadMore}
            className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-8 rounded-full transition-colors duration-300 shadow-md"
          >
            Load More
          </button>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="mt-16 text-center">
        <Link 
          to="/events" 
          className="inline-block bg-primary text-white text-lg font-medium px-10 py-4 rounded-full hover:bg-primary/90 transition-colors duration-300 shadow-lg"
        >
          Find Your Next Event
        </Link>
      </motion.div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedItem(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={`card-${selectedItem.src}`}
              className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image itself
            >
              <img src={selectedItem.src} alt={selectedItem.alt} className="w-auto h-auto max-w-full max-h-[80vh] rounded-lg shadow-2xl" />
              <motion.div 
                className="text-center text-white mt-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
              >
                <h3 className="text-2xl font-bold">{selectedItem.caption}</h3>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GalleryPage;