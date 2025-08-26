import React from 'react';
import c2b2Logo from '/logos/C2B2-Logo-Landscape-w-nosize.svg';
import mistraLogo from '/logos/Mistra_logo_RGB-1536x570.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">   
          {/* Copyright and Links */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-neutral-600">
            <p className="text-center md:text-left">
              © 2025 Mistra Co-Creating a Better Blue (C2B2)
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.linkedin.com/company/mistra-c2b2/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;