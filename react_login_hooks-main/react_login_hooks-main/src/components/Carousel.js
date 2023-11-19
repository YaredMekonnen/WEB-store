import { useState, useEffect } from 'react';

export function Carousel(props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const nextImage = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % props.images.length);
  };

  const prevImage = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + props.images.length) % props.images.length);
  };

  return (
    <>
      <div className="flex w-full h-screen p-10 mt-0 overflow-hidden">
        {/* Image carousel covering half of the screen on the left */}
        <div
          id="controls-carousel"
          className="relative w-1/2 h-full overflow-hidden"
          data-carousel="static"
        >
          {props.images.map((image, index) => (
            <div
              key={index}
              className={`duration-700 ease-in-out transition-opacity ${
                index === activeIndex ? 'opacity-100' : 'opacity-0'
              }`}
              data-carousel-item={index === activeIndex ? 'active' : ''}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
              }}
            >
              <img src={image} className="w-full h-full object-cover" alt={`carousel-image-${index}`} />
            </div>
          ))}

          <button
            type="button"
            onClick={prevImage}
            className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-prev
          >
            <span>Previous</span>
          </button>
          <button
            type="button"
            onClick={nextImage}
            className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-next
          >
            <span>Next</span>
          </button>
        </div>

        {/* Content on the right side */}
        <div className="w-1/2 bg-base-300 ml-12 mt-2">
        <p class="mb-3 text-gray-500 dark:text-gray-400 overflow-hidden">{props.desc}</p>
        </div>
      </div>
    </>
  );
}
