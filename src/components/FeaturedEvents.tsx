import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { useEvents } from '../context/EventContext';

// Placeholder images for events without a specific image
const placeholderImages = [
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const FeaturedEvents: React.FC = () => {
  const { events, loading, error } = useEvents();

  // Get the next 3 upcoming, approved events
  const featuredEvents = events
    .filter(event => event.status === 'approved' && new Date(event.eventDate) > new Date())
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Dinners</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these upcoming opportunities to connect.
          </p>
        </motion.div>

        {loading && <div className="text-center">Loading events...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event, index) => {
              const imageToDisplay = event.imageUrl || placeholderImages[index % placeholderImages.length];
              return (
                <motion.div
                  key={event._id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <Link
                    to={`/events/${event._id}`}
                    className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative">
                      <img src={imageToDisplay} alt={event.title} className="w-full h-56 object-cover" />
                      <div className="absolute top-4 right-4 bg-white/90 text-primary font-bold text-center rounded-md px-3 py-2 shadow-sm">
                        <div className="text-2xl leading-none">{formatDate(event.eventDate).split(' ')[1]}</div>
                        <div className="text-sm uppercase tracking-wider">{formatDate(event.eventDate).split(' ')[0]}</div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{event.title}</h3>
                      <div className="flex items-center text-gray-500 mb-4">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span>{event.location}</span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-3 h-20">{event.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{Array.isArray(event.participants) ? event.participants.length : 0} / {event.maxParticipants} spots</span>
                        <span className="text-indigo-600 font-medium text-sm">View Details →</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedEvents;