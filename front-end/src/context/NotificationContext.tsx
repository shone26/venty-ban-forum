import React from 'react';
import { Shield, Mail, MessageCircle, HelpCircle, ExternalLink } from 'lucide-react';

const ModernFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6 md:order-2">
            {/* Quick Links */}
            <a href="/help" className="text-gray-500 hover:text-gray-600">
              <span className="sr-only">Help Center</span>
              <HelpCircle size={20} />
            </a>
            <a href="/support" className="text-gray-500 hover:text-gray-600">
              <span className="sr-only">Support</span>
              <MessageCircle size={20} />
            </a>
            <a href="mailto:support@gtarp.com" className="text-gray-500 hover:text-gray-600">
              <span className="sr-only">Email</span>
              <Mail size={20} />
            </a>
            <a href="https://github.com/yourusername" className="text-gray-500 hover:text-gray-600">
              <span className="sr-only">Repository</span>
              <ExternalLink size={20} />
            </a>
          </div>
          
          {/* Logo */}
          <div className="flex items-center justify-center md:justify-start md:order-1 mt-4 md:mt-0">
            <Shield size={20} className="text-blue-600 mr-1.5" />
            <span className="text-gray-900 font-medium text-sm">GTA RP Ban Management System</span>
          </div>
        </div>
        
        {/* Copyright and Secondary Links */}
        <div className="mt-6 border-t border-gray-100 pt-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-xs text-gray-500">
              &copy; {currentYear} GTA RP Ban Management System. All rights reserved.
            </div>
            
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-4 text-xs text-gray-500">
                <li><a href="/privacy" className="hover:text-gray-700">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-gray-700">Terms of Service</a></li>
                <li><a href="/guidelines" className="hover:text-gray-700">Community Guidelines</a></li>
                <li><a href="/changelog" className="hover:text-gray-700">Changelog</a></li>
              </ul>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-4 text-xs text-gray-400 text-center md:text-left">
            This system is not affiliated with Rockstar Games, Take-Two Interactive, or Grand Theft Auto V.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;