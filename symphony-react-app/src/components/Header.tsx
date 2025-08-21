import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from './Container';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-neutral-200/50 shadow-sm animate-fade-in sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between py-4">
          {/* Logo Section */}
          <div 
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <img 
              src="/logos/C2B2-Logo-Landscape-w-nosize.svg" 
              alt="C2B2 Logo" 
              className="h-8 w-auto transition-transform duration-200 group-hover:scale-105"
            />
            <div className="hidden sm:block w-px h-6 bg-neutral-300"></div>
            <img 
              src="/logos/Mistra_logo_RGB-1536x570.png" 
              alt="Mistra Logo" 
              className="h-6 w-auto transition-transform duration-200 group-hover:scale-105"
            />
          </div>

          {/* Navigation Section */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
            >
              Home
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;