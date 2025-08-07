import React, { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import PastRaffles from "@/components/PastRaffles";
import CheckTickets from "@/components/CheckTickets";
import Footer from "@/components/Footer";
import TermsModal from "@/components/TermsModal";
import type { RefObject } from "react";
import { Raffle } from "@/types/Raffle";


const Index = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCheckTickets, setShowCheckTickets] = useState(false);
  const [raffles, setRaffles] = useState<Raffle[]>([]);

  type HeroHandle = {
    openPurchaseModal: (raffle?: Raffle) => void;
  };

  const heroRef = useRef<HeroHandle | null>(null);

  useEffect(() => {
    const hasAcceptedTerms = localStorage.getItem("sorteoVIP_termsAccepted");
    if (!hasAcceptedTerms) {
      setShowTermsModal(true);
    }
  }, []);

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/raffles/active"
        );
        const data = await response.json();
        setRaffles(data);
      } catch (error) {
        console.error("Error al obtener rifas activas:", error);
      }
    };

    fetchRaffles();
  }, []);

  const handleAcceptTerms = () => {
    setShowTermsModal(false);
  };

  const handleCheckTickets = () => {
    setShowCheckTickets(true);
    setTimeout(() => {
      const element = document.getElementById("check-tickets");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleParticipateClick = () => {
    if (
      heroRef.current &&
      typeof heroRef.current.openPurchaseModal === "function"
    ) {
      heroRef.current.openPurchaseModal(undefined);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation
        onCheckTickets={handleCheckTickets}
        onParticipateClick={handleParticipateClick}
      />

      <main>
        <section id="hero">
          <Hero ref={heroRef} raffles={raffles} />
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
