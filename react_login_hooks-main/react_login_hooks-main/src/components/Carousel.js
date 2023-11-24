import React, { useState, useEffect } from 'react';

export function Carousel(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % props.images.length);
  };

  const prevImage = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + props.images.length) % props.images.length);
  };

  return (
    <div className="relative w-full h-96">
      <div className="relative w-full h-full">
        {props.images.map((image, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            data-carousel-item={index === activeIndex ? 'active' : ''}
          >
            <img
              src={image}
              alt={`carousel-image-${index}`}
              className="w-full h-full object-cover"
            />

            <button
              type="button"
              onClick={prevImage}
              className="absolute top-0 left-0 flex items-center justify-center h-full w-1/2 px-4 cursor-pointer group focus:outline-none"
              data-carousel-prev
            >
              {/* ... Your SVG for the previous button ... */}
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute top-0 right-0 flex items-center justify-center h-full w-1/2 px-4 cursor-pointer group focus:outline-none"
              data-carousel-next
            >
              {/* ... Your SVG for the next button ... */}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
