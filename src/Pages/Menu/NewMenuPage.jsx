import React, { useState } from "react";
import m from "../../assets/Images/m.jpeg";
import m1 from "../../assets/Images/m1.jpg";
import m2 from "../../assets/Images/m2.jpg";
import m3 from "../../assets/Images/m3.jpg";

import { AiOutlineClose, AiOutlineLeft, AiOutlineRight } from "react-icons/ai"; // Importing icons
import { useTranslation } from 'react-i18next'; // <-- Importing useTranslation hook

const menuImages = [m, m1,m2,m3,]; // Array of menu images

const NewMenuPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { t, i18n } = useTranslation(); // <-- use i18n to change language

  const handlePrev = () => {
    setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : menuImages.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prevIndex) => (prevIndex < menuImages.length - 1 ? prevIndex + 1 : 0));
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
      {menuImages.map((src, index) => (
        <div key={index} className="overflow-hidden rounded-lg">
          <img
            src={src}
            alt={`menu-item-${index}`}
            className="w-full lg:h-[520px] h-auto cursor-pointer transition-transform duration-300 hover:scale-110"
            onClick={() => setSelectedIndex(index)}
          />
        </div>
      ))}

      {/* Fullscreen Image View */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black bg-opacity-80 md:p-8">
          {/* Close Button */}
          <button
            className="absolute p-2 text-black transition bg-white rounded-full shadow-lg top-5 right-5 hover:bg-gray-300"
            onClick={() => setSelectedIndex(null)}
          >
            <AiOutlineClose size={24} className="text-mainColor"/>
          </button>

          {/* Previous Button */}
          <button
            className="absolute p-1 text-black transition bg-white rounded-full shadow-lg left-1 xl:left-24 hover:bg-gray-300"
            onClick={handlePrev}
          >
            <AiOutlineLeft size={20} className="text-mainColor" />
          </button>

          {/* Display Image */}
          <img src={menuImages[selectedIndex]} className="max-w-full max-h-full rounded-lg" alt="Enlarged" />

          {/* Next Button */}
          <button
            className="absolute p-1 text-black transition bg-white rounded-full shadow-lg right-1 xl:right-24 hover:bg-gray-300"
            onClick={handleNext}
          >
            <AiOutlineRight size={20} className="text-mainColor"/>
          </button>
        </div>
      )}
    </div>
  );
};

export default NewMenuPage;
