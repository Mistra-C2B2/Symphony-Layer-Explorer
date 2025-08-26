import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from './Container';
import c2b2Logo from '/logos/C2B2-Logo-Landscape-w-nosize.svg';
import mistraLogo from '/logos/Mistra_logo_RGB-1536x570.png';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#218381] border-b border-[#1a6b69] shadow-sm animate-fade-in sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-center py-4">
          {/* Logo Section */}
          <div 
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <a 
              href="https://www.c2b2.se" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform duration-200 hover:scale-105"
            >
              <img 
                src={c2b2Logo} 
                alt="C2B2 Logo" 
                className="h-20 w-auto"
              />
            </a>
            <div className="hidden sm:block w-px h-6 bg-white/30"></div>
            <a 
              href="https://www.mistra.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform duration-200 hover:scale-105"
            >
              <img 
                src={mistraLogo} 
                alt="Mistra Logo" 
                className="h-[110px] w-auto"
              />
            </a>
          </div>

        </div>
      </Container>
    </header>
  );
};

export default Header;