import React from 'react';
import Container from './Container';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white relative overflow-hidden">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <Container>
        <div className="relative py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight mb-6 lg:mb-8">
              <span className="block">Symphony Layers</span>
              <span className="block text-white/90">Interactive Explorer</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl lg:text-3xl text-white/90 font-medium mb-8 lg:mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover Sweden's marine spatial planning ecosystem layers with AI-powered analysis and oceanographic insights
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 lg:gap-12 mb-12 lg:mb-16">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">77</div>
                <div className="text-white/80 text-sm lg:text-base font-medium">Symphony Layers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">468</div>
                <div className="text-white/80 text-sm lg:text-base font-medium">P02 Parameters</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">17</div>
                <div className="text-white/80 text-sm lg:text-base font-medium">Thematic Areas</div>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-2xl hover:bg-white/95 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl">
                Explore Layers
              </button>
              <button className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;