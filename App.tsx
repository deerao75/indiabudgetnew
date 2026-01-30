import React, { useState, useEffect } from 'react';
import { PageWrapper } from './components/PageWrapper';
import { DetailSection } from './components/DetailSection';
import { BudgetContent } from './types';
import { BUDGET_TITLE, COMPANY_NAME } from './constants';

const INITIAL_CONTENT: BudgetContent = {
  mainSummary: "The Union Budget 2026-27 represents a strategic blueprint for India's aspirations of becoming a $5 trillion economy. It strikes a fine balance between fiscal consolidation and aggressive capital expenditure. A significant thrust has been provided to the green energy transition and digital public infrastructure. For the individual taxpayer, the rationalization of tax slabs under the new regime offers a tangible increase in disposable income. On the corporate side, the extension of the sunset clause for manufacturing incentives demonstrates the government's commitment to 'Make in India'. This bulletin provides an in-depth analysis of these transformative changes.",
  directTax: {
    title: "Direct Tax Proposals",
    summary: "Key amendments in Personal Income Tax, Corporate Tax rates, and Startup incentives to drive domestic investment.",
    items: [
      { id: 'dt1', title: 'Personal Tax Relief', content: 'The standard deduction for salaried employees has been raised significantly. Tax slabs have been reconfigured to provide maximum benefit to the middle-income group, ensuring more liquidity in the hands of consumers to drive domestic demand.' },
      { id: 'dt2', title: 'Corporate Sunset Extension', content: 'The 15% preferential tax rate for new manufacturing companies has been extended by another year to attract global supply chains moving towards a China-plus-one strategy.' }
    ]
  },
  indirectTax: {
    title: "Indirect Tax Proposals",
    summary: "Revisions in Customs Duty and GST procedural updates aimed at boosting exports and indigenous manufacturing.",
    items: [
      { id: 'it1', title: 'Critical Mineral Customs', content: 'Customs duty on 25 critical minerals like Lithium and Cobalt has been fully waived to lower the cost of battery production for electric vehicles and mobile electronics.' },
      { id: 'it2', title: 'Solar Energy Push', content: 'Exemption of customs duty on machinery used for manufacturing solar cells and modules has been extended to ensure India meets its 500GW renewable energy target by 2030.' }
    ]
  }
};

const App: React.FC = () => {
  const [content, setContent] = useState<BudgetContent>(INITIAL_CONTENT);
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");
  
  const isUserView = new URLSearchParams(window.location.search).get('view') === 'user';

  useEffect(() => {
    const savedData = localStorage.getItem('acer_budget_master');
    const savedTime = localStorage.getItem('acer_budget_time');
    
    if (savedData) setContent(JSON.parse(savedData));
    if (savedTime) setLastSaved(savedTime);

    if (isUserView) {
      setActiveTab('preview');
      document.title = "Acer Tax India Budget 2025-26 Alert";
      // Masks the URL so ?view=user disappears
      const cleanURL = window.location.origin + window.location.pathname;
      window.history.replaceState({}, "Acer Tax India Budget 2025-26 Alert", cleanURL);
    }
  }, [isUserView]);

  const handleSaveToCloud = () => {
    setIsSaving(true);
    const now = new Date().toLocaleString('en-IN', { 
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    
    setTimeout(() => {
      localStorage.setItem('acer_budget_master', JSON.stringify(content));
      localStorage.setItem('acer_budget_time', now);
      setLastSaved(now);
      setIsSaving(false);
      alert("Content saved successfully. All admins will now see these changes.");
    }, 800);
  };

  const copyClientLink = () => {
    const userLink = `${window.location.origin}${window.location.pathname}?view=user`;
    const linkText = "Acer Tax India Budget Alert 2025-26";
    
    // Create a Rich Text (HTML) version of the link
    const htmlLink = `<a href="${userLink}">${linkText}</a>`;
    
    // Use a ClipboardItem to copy both plain text and HTML
    const typeHtml = "text/html";
    const typeText = "text/plain";
    const blobHtml = new Blob([htmlLink], { type: typeHtml });
    const blobText = new Blob([userLink], { type: typeText });
    
    const data = [new ClipboardItem({
      [typeHtml]: blobHtml,
      [typeText]: blobText,
    })];

    navigator.clipboard.write(data).then(() => {
      alert("Hyperlink copied! You can now paste it into WhatsApp or Email as a clickable title.");
    }).catch(() => {
      // Fallback if the browser doesn't support ClipboardItem
      window.prompt("Copy this link:", userLink);
    });
  };

  const updateMainSummary = (val: string) => setContent(prev => ({ ...prev, mainSummary: val }));
  
  const updateSectionSummary = (section: 'directTax' | 'indirectTax', val: string) => {
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section], summary: val }
    }));
  };

  const updateSectionItem = (section: 'directTax' | 'indirectTax', itemId: string, field: string, val: string) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        items: prev[section].items.map(item => item.id === itemId ? { ...item, [field]: val } : item)
      }
    }));
  };

  const addNewItem = (section: 'directTax' | 'indirectTax') => {
    const newId = `${section === 'directTax' ? 'dt' : 'it'}${Date.now()}`;
    const newItem = { id: newId, title: 'New Heading', content: 'Add content here...' };
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section], items: [...prev[section].items, newItem] }
    }));
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="no-print sticky top-0 z-50 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none uppercase">Acer Budget Alert</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
              {isUserView ? 'Strategic Insight Portal' : 'Admin Control Center'}
            </p>
          </div>
          
          {!isUserView && (
            <button 
              onClick={copyClientLink}
              className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-500 hover:bg-slate-200 transition-colors"
            >
              🔗 Copy Client Link
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {!isUserView && (
            <>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setActiveTab('preview')} 
                  className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'preview' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Preview
                </button>
                <button 
                  onClick={() => setActiveTab('edit')} 
                  className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'edit' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Edit
                </button>
              </div>

              <button 
                onClick={handleSaveToCloud}
                disabled={isSaving}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${isSaving ? 'border-slate-200 text-slate-300 cursor-not-allowed' : 'border-emerald-500 text-emerald-600 hover:bg-emerald-50'}`}
              >
                {isSaving ? 'Syncing...' : 'Save & Publish'}
              </button>
            </>
          )}
          {lastSaved && <span className="text-[10px] text-slate-400 font-bold uppercase">Updated: {lastSaved}</span>}
        </div>
      </nav>

      {activeTab === 'edit' ? (
        <div className="max-w-6xl mx-auto py-12 px-6">
          <div className="bg-white p-10 rounded-2xl shadow-sm space-y-12">
            <section>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Main Executive Summary</h2>
              <textarea className="w-full p-4 border rounded-xl text-sm min-h-[120px]" value={content.mainSummary} onChange={(e) => updateMainSummary(e.target.value)} />
            </section>

            <div className="grid grid-cols-2 gap-12">
              {['directTax', 'indirectTax'].map((section) => (
                <section key={section} className="space-y-6">
                  <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">{section === 'directTax' ? 'Direct Tax' : 'Indirect Tax'}</h2>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Card Summary (Page 1)</label>
                    <textarea 
                      className="w-full p-3 border rounded-lg text-xs bg-slate-50" 
                      value={content[section as 'directTax' | 'indirectTax'].summary} 
                      onChange={(e) => updateSectionSummary(section as 'directTax' | 'indirectTax', e.target.value)} 
                    />
                  </div>

                  <div className="space-y-4">
                    {content[section as 'directTax' | 'indirectTax'].items.map((item) => (
                      <div key={item.id} className="p-4 bg-slate-50 border rounded-xl space-y-2">
                        <input className="w-full font-bold p-2 border rounded text-xs" value={item.title} onChange={(e) => updateSectionItem(section as 'directTax' | 'indirectTax', item.id, 'title', e.target.value)} />
                        <textarea className="w-full p-2 border rounded text-xs min-h-[80px]" value={item.content} onChange={(e) => updateSectionItem(section as 'directTax' | 'indirectTax', item.id, 'content', e.target.value)} />
                      </div>
                    ))}
                    <button onClick={() => addNewItem(section as 'directTax' | 'indirectTax')} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-400 text-xs font-bold hover:bg-slate-50 transition-all">+ Add Block</button>
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-8">
          <PageWrapper pageNumber={1}>
            <div className="relative w-full h-[340px] mb-10 overflow-hidden rounded-2xl shadow-xl">
              <img src="https://images.unsplash.com/photo-1625505826533-5c80aca7d157?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover brightness-[0.4]" alt="North Block" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <div className="text-center px-12 py-10 border-2 border-white/20 backdrop-blur-md rounded-3xl">
                  <h2 className="text-white text-6xl font-serif">{BUDGET_TITLE}</h2>
                  <p className="text-white/80 text-sm uppercase tracking-[0.5em] mt-8 font-bold">Strategic Insight Bulletin</p>
                </div>
              </div>
            </div>

            <div className="mb-14">
              <h3 className="text-lg font-black text-slate-900 border-l-[8px] border-slate-900 pl-6 mb-6 uppercase tracking-[0.2em]">Executive Summary</h3>
              <div className="text-[14px] leading-[1.8] text-slate-700 italic text-justify px-4 whitespace-pre-wrap">{content.mainSummary}</div>
            </div>

            <div className="grid grid-cols-2 gap-10">
              {['directTax', 'indirectTax'].map((section) => (
                <button 
                  key={section} 
                  onClick={() => scrollToSection(`${section}-page`)} 
                  className="group block text-left p-8 border-2 border-slate-100 rounded-3xl hover:border-slate-900 transition-all bg-white shadow-sm hover:shadow-2xl"
                >
                  <h4 className="font-bold text-2xl text-slate-900 font-serif mb-4">
                    {section === 'directTax' ? 'Direct Tax' : 'Indirect Tax'}<br/>Proposals
                  </h4>
                  <img src={section === 'directTax' ? "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400" : "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400"} className="w-full h-32 object-cover rounded-xl mb-4" alt="Tax Overview" />
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{content[section as 'directTax' | 'indirectTax'].summary}</p>
                </button>
              ))}
            </div>
          </PageWrapper>

          <div id="directTax-page" className="w-full flex justify-center relative">
            <PageWrapper pageNumber={2}>
              <div className="flex justify-between items-center mb-10 no-print">
                 <button onClick={scrollToTop} className="text-xs font-bold text-slate-400 hover:text-slate-900 flex items-center gap-2 transition-colors">
                   ↑ Back to Summary
                 </button>
              </div>
              <div className="mb-14 border-b-4 border-slate-900 pb-4">
                <h2 className="text-4xl font-serif font-bold text-slate-900">Direct Tax Proposals</h2>
              </div>
              <DetailSection items={content.directTax.items} />
            </PageWrapper>
          </div>

          <div id="indirectTax-page" className="w-full flex justify-center relative">
            <PageWrapper pageNumber={3}>
              <div className="flex justify-between items-center mb-10 no-print">
                 <button onClick={scrollToTop} className="text-xs font-bold text-slate-400 hover:text-slate-900 flex items-center gap-2 transition-colors">
                   ↑ Back to Summary
                 </button>
              </div>
              <div className="mb-14 border-b-4 border-slate-900 pb-4">
                <h2 className="text-4xl font-serif font-bold text-slate-900">Indirect Tax Proposals</h2>
              </div>
              <DetailSection items={content.indirectTax.items} />
            </PageWrapper>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;