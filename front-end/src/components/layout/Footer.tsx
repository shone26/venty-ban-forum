// src/components/layout/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-300">
              © {currentYear} GTA RP Ban Management Forum. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            <a 
              href="#"
              className="text-sm text-gray-300 hover:text-white"
            >
              Terms of Service
            </a>
            <a 
              href="#"
              className="text-sm text-gray-300 hover:text-white"
            >
              Privacy Policy
            </a>
            <a 
              href="#"
              className="text-sm text-gray-300 hover:text-white"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;