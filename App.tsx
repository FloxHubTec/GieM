
import React, { useState, useEffect } from 'react';
import Scanner from './components/Scanner';
import ReceiptTable from './components/ReceiptTable';
import SQLReference from './components/SQLReference';
import { Receipt, ExtractionResult } from './types';
import { LayoutDashboard, Camera, Database, Package } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scan' | 'sql'>('dashboard');
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [lastExtraction, setLastExtraction] = useState<{data: ExtractionResult, image: string} | null>(null);

  useEffect(() => {
    // Dados iniciais (mock)
    const mock: Receipt[] = [
      {
        id: '1',
        nf_number: '001245',
        receiver_name: 'Ricardo Silva',
        product_description: '2x Monitor LG 27", 1x Teclado Mecânico',
        delivery_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        image_path: '',
        content_type: 'image/jpeg',
        user_id: 'user-1'
      }
    ];
    setReceipts(mock);
  }, []);

  const handleExtraction = (data: ExtractionResult, imageBase64: string) => {
    setLastExtraction({ data, image: `data:image/jpeg;base64,${imageBase64}` });
  };

  const saveReceipt = () => {
    if (!lastExtraction) return;
    const newReceipt: Receipt = {
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      nf_number: lastExtraction.data.nf_number,
      receiver_name: lastExtraction.data.receiver_name,
      product_description: lastExtraction.data.product_description,
      delivery_date: lastExtraction.data.delivery_date || new Date().toISOString(),
      image_path: 'local-path',
      content_type: 'image/jpeg',
      user_id: 'user-1'
    };
    setReceipts([newReceipt, ...receipts]);
    setLastExtraction(null);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-primary selection:text-white">
      {/* Header */}
      <header className="bg-brand-surface border-b border-brand-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-brand-primary p-2 rounded-lg shadow-lg shadow-orange-900/20">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white leading-none tracking-tight">GieM</h1>
                <p className="text-[10px] text-brand-primary uppercase tracking-[0.2em] font-black">Midnight Cargo</p>
              </div>
            </div>
            
            <nav className="flex gap-2">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'dashboard' ? 'text-brand-primary bg-orange-500/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button 
                onClick={() => setActiveTab('scan')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'scan' ? 'text-brand-primary bg-orange-500/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Escanear</span>
              </button>
              <button 
                onClick={() => setActiveTab('sql')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'sql' ? 'text-brand-primary bg-orange-500/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
              >
                <Database className="w-4 h-4" />
                <span className="hidden sm:inline">Supabase</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Logística de Cargas</h2>
                <p className="text-zinc-500 font-medium">Controle de entregas e recebimentos em tempo real.</p>
              </div>
              <button 
                onClick={() => setActiveTab('scan')}
                className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-xl shadow-orange-950/40 flex items-center gap-2 group"
              >
                <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Capturar Canhoto
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Entregas Registradas', val: receipts.length, color: 'text-white' },
                { label: 'Precisão IA', val: '99.8%', color: 'text-brand-primary' },
                { label: 'Status Sistema', val: 'Online', color: 'text-green-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-brand-surface p-6 rounded-2xl border border-brand-border">
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                  <p className={`text-3xl font-black mt-2 ${stat.color}`}>{stat.val}</p>
                </div>
              ))}
            </div>

            <ReceiptTable receipts={receipts} />
          </div>
        )}

        {activeTab === 'scan' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
            {!lastExtraction ? (
              <Scanner onDataExtracted={handleExtraction} />
            ) : (
              <div className="bg-brand-surface rounded-2xl shadow-2xl border border-brand-border overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 bg-brand-dark flex items-center justify-center p-6 border-r border-brand-border">
                    <img 
                      src={lastExtraction.image} 
                      alt="Preview" 
                      className="max-h-96 w-full object-contain rounded-lg shadow-2xl border border-brand-border"
                    />
                  </div>
                  <div className="md:w-3/5 p-8">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-2xl font-black text-white">Validar Carga</h2>
                        <p className="text-zinc-500 text-sm">IA processou os dados automaticamente.</p>
                      </div>
                      <div className="bg-orange-500/10 text-brand-primary text-[10px] px-2 py-1 rounded-md font-black uppercase tracking-wider border border-orange-500/20">
                        Extração IA
                      </div>
                    </div>
                    
                    <div className="space-y-5">
                      <div className="group">
                        <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 group-focus-within:text-brand-primary transition-colors">Nota Fiscal (NF-e)</label>
                        <input 
                          type="text" 
                          value={lastExtraction.data.nf_number}
                          onChange={(e) => setLastExtraction({...lastExtraction, data: {...lastExtraction.data, nf_number: e.target.value}})}
                          className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-primary focus:outline-none focus:border-transparent font-bold text-white transition-all"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 group-focus-within:text-brand-primary transition-colors">Recebedor Final</label>
                        <input 
                          type="text" 
                          value={lastExtraction.data.receiver_name}
                          onChange={(e) => setLastExtraction({...lastExtraction, data: {...lastExtraction.data, receiver_name: e.target.value}})}
                          className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-primary focus:outline-none focus:border-transparent text-zinc-200 transition-all"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 group-focus-within:text-brand-primary transition-colors">Manifesto de Produtos</label>
                        <textarea 
                          rows={3}
                          value={lastExtraction.data.product_description}
                          onChange={(e) => setLastExtraction({...lastExtraction, data: {...lastExtraction.data, product_description: e.target.value}})}
                          className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-primary focus:outline-none focus:border-transparent text-zinc-300 resize-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="mt-10 flex gap-4">
                      <button 
                        onClick={() => setLastExtraction(null)}
                        className="flex-1 px-4 py-4 rounded-xl border border-brand-border text-zinc-400 font-bold hover:bg-zinc-800 hover:text-white transition-all"
                      >
                        Descartar
                      </button>
                      <button 
                        onClick={saveReceipt}
                        className="flex-[2] px-4 py-4 rounded-xl bg-brand-primary text-white font-black hover:bg-orange-600 transition-all shadow-lg shadow-orange-950/20"
                      >
                        Confirmar Entrega
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sql' && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <SQLReference />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-brand-surface border-t border-brand-border py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-primary" />
            <span className="text-zinc-500 font-black text-xs uppercase tracking-[0.3em]">GieM Platform</span>
          </div>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            Logística Inteligente &copy; 2024 • Powered by Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
