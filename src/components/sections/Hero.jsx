// src/components/sections/Hero.jsx
import Carousel from '../ui/Carousel';

// Assets
import CapStreetImage from '../../assets/images/editorial/cap-haitien-street.webp';
import HeroCapImage from '../../assets/images/editorial/hero-cap-haitien.webp';
import InterurbanImage from '../../assets/images/editorial/interurban-road.webp';

const Hero = () => {
  // Images pour le carousel
  const heroImages = [
    HeroCapImage,
    CapStreetImage,
    InterurbanImage
  ];

  return (
    <section className="relative h-[72svh] min-h-[520px] md:h-[88svh]" aria-label="LIMAJS MOTORS">
      {/* Carousel en arrière-plan */}
      <div className="absolute inset-0 z-0">
        <Carousel
          images={heroImages}
          autoPlayInterval={6000}
          className="w-full h-full"
          height="h-full"
          overlay={false}
          showDots={false}
          showArrows={false}
          borderRadius=""
        />
      </div>
    </section>
  );
};

export default Hero;
