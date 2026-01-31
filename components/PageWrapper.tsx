import React from 'react';
import { Logo, COMPANY_NAME } from '../constants';

interface PageWrapperProps {
  children: React.ReactNode;
  pageNumber: number;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, pageNumber }) => {
  return (
    /* Responsive container: Full width on mobile, A4 constrained on desktop */
    <div className="bg-white shadow-2xl mx-auto my-0 md:my-8 p-6 md:p-12 w-full md:max-w-[210mm] min-h-screen md:min-h-[297mm] relative flex flex-col page-break box-border overflow-hidden">
      
      {/* RESPONSIVE HEADER: Stacks and centers on mobile, spreads row on desktop */}
      <header className="flex flex-col md:flex-row justify-between items-center md:items-start border-b border-slate-200 pb-4 mb-6 gap-3">
        
        {/* Logo and Branding Container */}
        <div className="flex flex-col items-center md:items-start w-full md:w-auto">
          <Logo />
          {/* Company Name and Tagline: Centered on mobile, aligned left on desktop */}
          <div className="text-center md:text-left mt-2">
            <h1 className="text-[11px] md:text-sm font-bold text-slate-800 tracking-tight uppercase">
              {COMPANY_NAME}
            </h1>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
              Economic Survey & Budget Alert
            </p>
          </div>
        </div>

        {/* Bulletin Info: Centered on mobile, aligned right on desktop */}
        <div className="text-center md:text-right w-full md:w-auto flex flex-col justify-end h-full">
          <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
            Budget Alert Bulletin
          </p>
          <p className="text-[10px] text-slate-400">
            Tax & Regulatory Updates
          </p>
        </div>
      </header>

      {/* Main Content: Justification is handled via global CSS in index.html */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer: Responsive text sizes for mobile */}
      <footer className="mt-8 border-t border-slate-100 pt-4 flex justify-between items-center text-[8px] md:text-[10px] text-slate-400 uppercase tracking-widest">
        <span>{COMPANY_NAME} &copy; 2026</span>
        <span className="font-bold">Page {pageNumber}</span>
      </footer>
    </div>
  );
};