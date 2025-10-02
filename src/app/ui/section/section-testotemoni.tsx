'use client'
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import TestimoniCardComponent from "../card/testinomi-card";

export default function SectionTestotemoni() {
  // Dummy data for 6 cards
  const cards = new Array(6).fill({
    imageSrc: "/images/3d22699224ba8c07d044e0b3cb60b785559e7c03.png",
    altText: "Budi",
    name: "Budi",
    title: "Pemilik Kedai Kopi Nusantara",
    description: "Pemilik Kedai Kopi Nusantara",
    quote: "Prosesnya super gampang! Saya bisa punya website profesional tanpa harus pusing soal teknis. Pelanggan pun jadi lebih percaya dengan brand saya."
  });

  // State for toggling card visibility
  const [isCardsVisible, setIsCardsVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  // Update window width after component mounts
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);

    // Add event listener on mount
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cards to show based on screen size and visibility state
  const visibleCards = isCardsVisible || windowWidth >= 1024 ? cards : cards.slice(0, Math.ceil(cards.length / 2));

  // Toggle visibility of the cards
  const toggleCards = () => {
    setIsCardsVisible(!isCardsVisible);
  };

  return (
    <div className="flex flex-col gap-4 my-10 sm:my-12 lg:my-15 px-5 sm:px-6 lg:px-10 justify-center items-center">
      {/* Row 1: Main Heading and Description */}
      <div className="w-full flex flex-col justify-center items-center text-center h-auto">
        <small className="text-green-c mb-2 text-center text-base lg:text-lg font-bold">Testimoni & Kisah Inspiratif</small>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-2">
        Cerita Mereka yang Berani Melangkah
        </h2>
        <p className="font-normal text-[#535a56] text-base lg:text-lg max-w-3xl">
        Perubahan itu nyata. Dengan dukungan digital, UMKM bisa menemukan peluang baru dan
        meraih pelanggan lebih luas.
        </p>
      </div>

      {/* Horizontal Scrollable Testimoni Cards with Maximum 3 Rows */}
      <div className="w-full overflow-x-auto py-4 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCards.map((card, index) => (
            <motion.div
              key={index}
              className="transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 80, damping: 20 }}
            >
              <TestimoniCardComponent
                imageSrc={card.imageSrc}
                altText={card.altText}
                name={card.name}
                title={card.title}
                description={card.description}
                quote={card.quote}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile-only Button to Toggle Collapse/Expand Cards */}
      <button 
        className="sm:hidden mt-4 px-6 py-2 bg-green-c text-white rounded-full hover:bg-green-800 transition duration-300"
        onClick={toggleCards}
      >
        {isCardsVisible ? "Sembunyikan" : "Tampilkan semua"}
      </button>
    </div>
  );
}
