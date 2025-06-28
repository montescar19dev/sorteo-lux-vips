
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import PastRaffles from '@/components/PastRaffles';
import CheckTickets from '@/components/CheckTickets';
import Footer from '@/components/Footer';
import TermsModal from '@/components/TermsModal';

const Index = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCheckTickets, setShowCheckTickets] = useState(false);

  useEffect(() => {
    // Check if user has already accepted terms
    const hasAcceptedTerms = localStorage.getItem('sorteoVIP_termsAccepted');
    if (!hasAcceptedTerms) {
      setShowTermsModal(true);
    }
  }, []);

  const handleAcceptTerms = () => {
    setShowTermsModal(false);
  };

  const handleCheckTickets = () => {
    setShowCheckTickets(true);
    // Scroll to check tickets section
    setTimeout(() => {
      const element = document.getElementById('check-tickets');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <Navigation onCheckTickets={handleCheckTickets} />
      
      <main>
        <section id="hero">
          <Hero />
        </section>
        
        <section id="past-raffles">
          <PastRaffles />
        </section>
        
        {showCheckTickets && (
          <section id="check-tickets">
            <CheckTickets />
          </section>
        )}
      </main>
      
      <Footer />
      
      <TermsModal 
        isOpen={showTermsModal}
        onClose={() => {}}
        onAccept={handleAcceptTerms}
      />
    </div>
  );
};

export default Index;
