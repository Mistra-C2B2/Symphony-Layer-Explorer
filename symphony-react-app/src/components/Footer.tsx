import React from 'react';
import c2b2Logo from '/logos/C2B2-Logo-Landscape-w-nosize.svg';
import mistraLogo from '/logos/Mistra_logo_RGB-1536x570.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logos */}
          <div className="flex items-center gap-8">
            <img 
              src={c2b2Logo} 
              alt="C2B2 Logo" 
              className="h-12 w-auto"
            />
            <img 
              src={mistraLogo} 
              alt="Mistra Logo" 
              className="h-12 w-auto"
            />
          </div>

          {/* Copyright and Links */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-neutral-600">
            <p className="text-center md:text-left">
              © 2024 Symphony Layers Interactive Explorer
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="hover:text-primary-500 transition-colors duration-200"
              >
                About
              </a>
              <a 
                href="#" 
                className="hover:text-primary-500 transition-colors duration-200"
              >
                Contact
              </a>
              <a 
                href="#" 
                className="hover:text-primary-500 transition-colors duration-200"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;