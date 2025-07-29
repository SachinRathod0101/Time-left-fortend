import React from 'react';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import Statistics from '../components/Statistics';
import CTA from '../components/CTA';
import EventsPage from './EventsPage';
import FeaturedGallery from '../components/FeaturedGallery';

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <EventsPage />
      <FeaturedGallery />
      <Statistics />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default HomePage;