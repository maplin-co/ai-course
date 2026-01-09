import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CaseStudies from '../components/CaseStudies';
import PlatformFeatures from '../components/PlatformFeatures';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <PlatformFeatures />
      <CaseStudies />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;