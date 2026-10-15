import React from 'react';
import {
  FooterPersonalInfo,
  FooterQuickLinks,
  FooterContactInfo,
  FooterCopyright,
} from './footer-section';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-slate-50 theme-transition dark:border-gray-800 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          <FooterPersonalInfo />
          <FooterQuickLinks />
          <FooterContactInfo />
        </div>
        <FooterCopyright />
      </div>
    </footer>
  );
}
