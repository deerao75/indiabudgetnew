import React, { useState, useEffect } from 'react';
import { PageWrapper } from './components/PageWrapper';
import { DetailSection } from './components/DetailSection';
import { BudgetContent, TaxSection, TaxItem } from './types';
import { BUDGET_TITLE, COMPANY_NAME } from './constants';

const INITIAL_CONTENT: BudgetContent = {
  mainSummary: "The Union Budget 2026-27 and the preceding Economic Survey present a robust roadmap for India's transition toward a 'Viksit Bharat'. The survey highlights a resilient GDP growth projection of 7%, anchored by strong domestic demand, a surge in high-tech manufacturing, and significant improvements in digital public infrastructure. This fiscal strategy strikes a critical balance between necessary fiscal consolidation and aggressive capital expenditure to ensure long-term sustainability.\n\nFurthermore, the budget places a significant thrust on the green energy transition and human capital development. For the individual taxpayer, the rationalization of tax slabs under the new regime offers a tangible increase in disposable income, while the corporate sector benefits from extended manufacturing incentives. This bulletin provides a consolidated analysis of the Economic Survey observations alongside detailed Direct and Indirect Tax proposals to provide a 360-degree view of the current fiscal landscape.",
  economicSurvey: {
    title: "Economic Survey Observations",
    summary: "Key highlights on India's macroeconomic health, GDP growth projections, and sectoral performance analysis.",
    items: [
      { id: 'es1', title: 'GDP Growth Outlook', content: 'The survey projects a real GDP growth of 6.5% to 7.0% for FY27, noting that India remains the fastest-growing major economy despite global headwinds.' },
      { id: 'es2', title: 'Capital Formation', content: 'Private sector capital formation has seen a 20% uptick, signaling renewed corporate confidence and a shift from public-led to private-led investment cycles.' }
    ]
  },
  directTax: {
    title: "Direct Tax Proposals",
    summary: "Key amendments in Personal Income Tax, Corporate Tax rates, and Startup incentives to drive domestic investment.",
    items: [
      { id: 'dt1', title: 'Personal Tax Relief', content: 'The standard deduction for salaried employees has been raised significantly. Tax slabs have been reconfigured to provide maximum benefit to the middle-income group.' },
      { id: 'dt2', title: 'Corporate Sunset Extension', content: 'The 15% preferential tax rate for new manufacturing companies has been extended by another year.' }
    ]
  },
  indirectTax: {
    title: "Indirect Tax Proposals",
    summary: "Revisions in Customs Duty and GST procedural updates aimed at boosting exports and indigenous manufacturing.",
    items: [
      { id: 'it1', title: 'Critical Mineral Customs', content: 'Customs duty on 25 critical minerals like Lithium and Cobalt has been fully waived to lower the cost of EV battery production.' },
      { id: 'it2', title: 'Solar Energy Push', content: 'Exemption of customs duty on machinery used for manufacturing solar cells has been extended.' }
    ]
  }
};

const App: React.FC = () => {
  const [content, setContent] = useState<BudgetContent>(INITIAL_CONTENT);
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");
  
  const isUserView = new URLSearchParams(window.location.search).get('view') === 'user';

  const paginateItems = (items: TaxItem[], limit: number = 10) => {
    const pages = [];
    for (let i = 0; i < items.length; i += limit) {
      pages.push(items.slice(i, i + limit));
    }
    return pages;
  };

  useEffect(() => {
    const savedData = localStorage.getItem('acer_budget_master');
    const savedTime = localStorage.getItem('acer_budget_time');
    if (savedData) setContent(JSON.parse(savedData));
    if (savedTime) setLastSaved(savedTime);

    if (isUserView) {
      setActiveTab('preview');
      document.title = "Economic Survey and India Budget 2026-27";
      window.history.replaceState({}, "", window.location.origin + window.location.pathname);
    }
  }, [isUserView]);

  const handleSaveToCloud = () => {
    setIsSaving(true);
    const now = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    setTimeout(() => {
      localStorage.setItem('acer_budget_master', JSON.stringify(content));
      localStorage.setItem('acer_budget_time', now);
      setLastSaved(now);
      setIsSaving(false);
      alert("Published Successfully.");
    }, 800);
  };

  const copyClientLink = () => {
    // Construct the URL specifically for the client
    const userLink = `${window.location.origin}${window.location.pathname}?view=user`;
    
    // The text the client will see in their email/WhatsApp
    const linkText = "Economic Survey and India Budget Alert 2026-27";
    
    // Create an HTML version so it's a clickable blue link in Outlook/Gmail
    const htmlLink = `<a href="${userLink}" style="color: #2563eb; text-decoration: underline;">${linkText}</a>`;
    
    const data = [
      new ClipboardItem({
        "text/html": new Blob([htmlLink], { type: "text/html" }),
        "text/plain": new Blob([userLink], { type: "text/plain" })
      })
    ];

    navigator.clipboard.write(data).then(() => alert("Client Hyperlink Copied! You can now paste this into an email or WhatsApp."));
  };

  const updateMainSummary = (val: string) => setContent(prev => ({ ...prev, mainSummary: val }));
  
  const updateSectionSummary = (section: keyof Omit<BudgetContent, 'mainSummary'>, val: string) => {
    setContent(prev => ({ 
      ...prev, 
      [section]: { ...(prev[section] as TaxSection), summary: val } 
    }));
  };

  const updateSectionItem = (section: keyof Omit<BudgetContent, 'mainSummary'>, itemId: string, field: string, val: string) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as TaxSection),
        items: (prev[section] as TaxSection).items.map(item => 
          item.id === itemId ? { ...item, [field]: val } : item
        )
      }
    }));
  };

  const addNewItem = (section: keyof Omit<BudgetContent, 'mainSummary'>) => {
    const newId = `${section}-${Date.now()}`;
    setContent(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as TaxSection),
        items: [...(prev[section] as TaxSection).items, { id: newId, title: 'New Analysis', content: 'Add detail here...' }]
      }
    }));
  };

  // NEW: Delete Item Function
  const deleteItem = (section: keyof Omit<BudgetContent, 'mainSummary'>, itemId: string) => {
    if (window.confirm("Are you sure you want to delete this block?")) {
      setContent(prev => ({
        ...prev,
        [section]: {
          ...(prev[section] as TaxSection),
          items: (prev[section] as TaxSection).items.filter(item => item.id !== itemId)
        }
      }));
    }
  };

  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  let globalPageCount = 1;

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="no-print sticky top-0 z-50 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight uppercase">{COMPANY_NAME}</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Economic Survey & Budget Alert</p>
          </div>
          {!isUserView && (
            <button onClick={copyClientLink} className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-500 hover:bg-slate-200">🔗 Copy Hyperlink</button>
          )}
        </div>
        <div className="flex items-center gap-4">
          {!isUserView && (
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button onClick={() => setActiveTab('preview')} className={`px-6 py-2 text-xs font-bold rounded-lg ${activeTab === 'preview' ? 'bg-white shadow-sm' : ''}`}>Preview</button>
              <button onClick={() => setActiveTab('edit')} className={`px-6 py-2 text-xs font-bold rounded-lg ${activeTab === 'edit' ? 'bg-white shadow-sm' : ''}`}>Edit</button>
            </div>
          )}
          {!isUserView && (
            <button onClick={handleSaveToCloud} disabled={isSaving} className={`px-6 py-2.5 rounded-xl text-sm font-bold border-2 ${isSaving ? 'border-slate-200 text-slate-300' : 'border-emerald-500 text-emerald-600'}`}>
              {isSaving ? 'Syncing...' : 'Save & Publish'}
            </button>
          )}
          {lastSaved && <span className="text-[9px] text-slate-400 font-bold uppercase">UPDATED: {lastSaved}</span>}
        </div>
      </nav>

      {activeTab === 'edit' ? (
        <div className="max-w-6xl mx-auto py-12 px-6">
          <div className="bg-white p-10 rounded-2xl shadow-sm space-y-12">
            <section>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Master Executive Summary</h2>
              <textarea className="w-full p-4 border rounded-xl text-sm min-h-[150px]" value={content.mainSummary} onChange={(e) => updateMainSummary(e.target.value)} />
            </section>
            {(['economicSurvey', 'directTax', 'indirectTax'] as const).map((section) => (
              <section key={section} className="space-y-6 border-t pt-8">
                <h2 className="text-sm font-black text-slate-600 uppercase tracking-widest">{section.replace(/([A-Z])/g, ' $1')}</h2>
                <textarea className="w-full p-3 border rounded-lg text-xs bg-slate-50" value={content[section].summary} onChange={(e) => updateSectionSummary(section, e.target.value)} />
                <div className="space-y-4">
                  {content[section].items.map((item) => (
                    <div key={item.id} className="relative p-4 bg-slate-50 border rounded-xl space-y-2 group">
                      {/* DELETE BUTTON */}
                      <button 
                        onClick={() => deleteItem(section, item.id)}
                        className="absolute top-2 right-2 text-slate-300 hover:text-red-500 text-[10px] font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-white border rounded shadow-sm"
                      >
                        Delete Block
                      </button>
                      <input className="w-full font-bold p-2 border rounded text-xs pr-20" value={item.title} onChange={(e) => updateSectionItem(section, item.id, 'title', e.target.value)} />
                      <textarea className="w-full p-2 border rounded text-xs min-h-[60px]" value={item.content} onChange={(e) => updateSectionItem(section, item.id, 'content', e.target.value)} />
                    </div>
                  ))}
                  <button onClick={() => addNewItem(section)} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-400 text-xs font-bold">+ Add Detail</button>
                </div>
              </section>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-8">
          <PageWrapper pageNumber={globalPageCount++}>
            <div className="relative w-full h-[240px] mb-8 overflow-hidden rounded-[40px] shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop" 
                className="w-full h-full object-cover brightness-[0.45]" 
                alt="Ministry of Finance India" 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                 <div className="px-8 py-6 border border-white/20 backdrop-blur-lg rounded-[32px]">
                    <h2 className="text-white text-3xl font-serif leading-tight">Economic Survey and<br/>India Budget 2026-27</h2>
                    <p className="text-white/60 text-[9px] uppercase tracking-[0.4em] mt-3 font-bold">Strategic Insight Bulletin</p>
                 </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-black text-slate-900 border-l-[5px] border-slate-900 pl-4 mb-3 uppercase tracking-widest">Executive Summary</h3>
              <div className="text-[13px] leading-[1.7] text-slate-700 italic text-justify px-2 whitespace-pre-wrap">
                {content.mainSummary}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              {(['economicSurvey', 'directTax', 'indirectTax'] as const).map((key) => (
                <button 
                  key={key} 
                  onClick={() => scrollToSection(`${key}-page`)} 
                  className="relative group text-left p-6 border border-slate-100 rounded-[35px] bg-white shadow-sm hover:shadow-2xl hover:border-slate-900 transition-all flex flex-col items-center h-full"
                >
                  <h4 className="font-bold text-sm text-slate-900 font-serif mb-4 text-center w-[120px] leading-tight min-h-[40px] flex items-center justify-center">
                    {content[key].title}
                  </h4>
                  <div className="w-full h-24 overflow-hidden rounded-2xl mb-4 bg-slate-100">
                    <img 
                      src={key === 'economicSurvey' ? 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop' : key === 'directTax' ? 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=400&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400&auto=format&fit=crop'} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      alt="Section focus" 
                    />
                  </div>
                  <p className="text-[9px] text-slate-500 font-medium leading-relaxed text-center">
                    {content[key].summary}
                  </p>
                </button>
              ))}
            </div>
          </PageWrapper>

          {(['economicSurvey', 'directTax', 'indirectTax'] as const).map((sectionKey) => {
            const paginatedItems = paginateItems(content[sectionKey].items);
            
            return paginatedItems.map((pageItems, pageIdx) => (
              <div 
                id={pageIdx === 0 ? `${sectionKey}-page` : undefined} 
                key={`${sectionKey}-${pageIdx}`} 
                className="w-full flex justify-center relative"
              >
                <PageWrapper pageNumber={globalPageCount++}>
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6 no-print">
                      <button onClick={scrollToTop} className="text-[9px] font-bold text-slate-400 hover:text-slate-900 tracking-[0.2em] uppercase transition-colors">↑ Back to Dashboard</button>
                    </div>
                    
                    {pageIdx === 0 && (
                      <div className="mb-10 border-b-2 border-slate-900 pb-3">
                        <h2 className="text-3xl font-serif font-bold text-slate-900">{content[sectionKey].title}</h2>
                      </div>
                    )}

                    <DetailSection items={pageItems} />

                    <div className="mt-auto pt-10 border-t border-slate-100 flex flex-col gap-4">
                      {pageIdx < paginatedItems.length - 1 ? (
                        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 italic font-bold text-center">
                          ( {content[sectionKey].title} continued on next page... )
                        </p>
                      ) : (
                        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-800 italic font-black text-center">
                          ( End of {content[sectionKey].title} Observations )
                        </p>
                      )}

                      {sectionKey === 'indirectTax' && pageIdx === paginatedItems.length - 1 && (
                        <p className="text-[8px] leading-relaxed text-slate-400 text-justify italic mt-4">
                          <strong>Disclaimer:</strong> This bulletin has been prepared by {COMPANY_NAME} for general information purposes only and does not constitute professional advice. 
                          While every effort has been made to ensure the accuracy of the information based on the Union Budget 2026-27 and Economic Survey 
                          presentations, tax laws are subject to change and varied interpretations. Readers are advised to consult with a qualified 
                          tax professional before taking any action based on the content of this alert. {COMPANY_NAME} accepts no liability for 
                          any loss arising from the use of this information.
                        </p>
                      )}
                    </div>
                  </div>
                </PageWrapper>
              </div>
            ));
          })}
        </div>
      )}
    </div>
  );
};

export default App;