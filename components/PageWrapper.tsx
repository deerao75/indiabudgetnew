import React from 'react';
import { Logo, COMPANY_NAME } from '../constants';

interface PageWrapperProps {
  children: React.ReactNode;
  pageNumber: number;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, pageNumber }) => {
  return (
    <div className="bg-white shadow-2xl mx-auto my-0 md:my-8 p-6 md:p-12 w-full md:max-w-[210mm] min-h-screen md:min-h-[297mm] relative flex flex-col page-break box-border overflow-hidden">
      
      {/* HEADER: flex-col for mobile (stacked), md:flex-row for desktop (side-by-side) */}
      <header className="flex flex-col md:flex-row justify-between items-center md:items-start border-b border-slate-200 pb-4 mb-6 gap-4">
        
        {/* Logo and Branding Container */}
        <div className="flex flex-col items-center md:items-start w-full md:w-auto">
          <Logo />
          <div className="text-center md:text-left mt-2">
          </div>
        </div>

        {/* Bulletin Info: Centered below branding on mobile */}
        <div className="text-center md:text-right w-full md:w-auto">
          <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
            Budget Alert Bulletin
          </p>
          <p className="text-[10px] text-slate-400">
            Tax & Regulatory Updates
          </p>
        </div>
      </header>

      {/* Main Content: Set to justify */}
      <main className="flex-grow text-justify">
        {children}
      </main>

      <footer className="mt-8 border-t border-slate-100 pt-4 flex justify-between items-center text-[8px] md:text-[10px] text-slate-400 uppercase tracking-widest">
        <span>{COMPANY_NAME} &copy; 2026</span>
        <span className="font-bold">Page {pageNumber}</span>
      </footer>
    </div>
  );
};