import React from 'react';
import { Logo } from '../constants';

interface PageWrapperProps {
  children: React.ReactNode;
  pageNumber: number;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, pageNumber }) => {
  return (
    /* Change: Added responsive width and height. 
       - w-full: Mobile takes full width.
       - md:max-w-[210mm]: Desktop stays at A4 width.
       - md:min-h-[297mm]: Desktop stays at A4 height.
       - md:my-8: Removes big margins on mobile.
    */
    <div className="bg-white shadow-2xl mx-auto my-0 md:my-8 p-6 md:p-12 w-full md:max-w-[210mm] min-h-screen md:min-h-[297mm] relative flex flex-col page-break box-border overflow-hidden">
      
      {/* Page Header - Stacks on mobile if logo is wide */}
      <header className="flex flex-row justify-between items-start border-b border-slate-200 pb-4 mb-6">
        <Logo />
        <div className="text-right">
          <p className="text-[8px] md:text-[10px] text-slate-400 font-medium tracking-widest uppercase">Budget Alert Bulletin</p>
          <p className="text-[8px] md:text-[10px] text-slate-400">Tax & Regulatory Updates</p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Page Footer */}
      <footer className="mt-8 border-t border-slate-100 pt-4 flex justify-between items-center text-[8px] md:text-[10px] text-slate-400 uppercase tracking-widest">
        <span>Acer Tax & Corporate Services LLP &copy; 2026</span>
        <span className="font-bold">Page {pageNumber}</span>
      </footer>
    </div>
  );
};
