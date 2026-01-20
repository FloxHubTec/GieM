
import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, FileText, Image as ImageIcon, 
  Loader2, Filter, ChevronRight, PackageX, AlertCircle,
  X, ArrowLeft
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Receipt } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HistoryPageProps {
  onBack: () => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ onBack }) => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchReceipts = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!supabase) {
        // Mock data fallback if Supabase is not configured
        await new Promise(resolve => setTimeout(resolve, 800));
        const mock: Receipt[] = [
          { id: '1', nf_number: '001245', receiver_name: 'Ricardo Silva', product_description: '2x Monitor LG 27"', delivery_date: new Date().toISOString(), created_at: new Date().toISOString(), image_path: '', content_type: 'image/jpeg', user_id: '1' },
          { id: '2', nf_number: '003982', receiver_name: 'Ana Paula', product_description: '1x Notebook Dell', delivery_date: new Date().toISOString(), created_at: new Date().toISOString(), image_path: '', content_type: 'application/pdf', user_id: '1' },
          { id: '3', nf_number: '004110', receiver_name: 'Manoel Gomes', product_description: 'Kit Ferramentas', delivery_date: new Date().toISOString(), created_at: new Date().toISOString(), image_path: '', content_type: 'image/png', user_id: '1' },
        ];
        
        let filtered = mock;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(r => 
            r.nf_number.toLowerCase().includes(q) || 
            r.receiver_name.toLowerCase().includes(q) || 
            r.product_description.toLowerCase().includes(q)
          );
        }
        if (dateFilter) {
          filtered = filtered.filter(r => r.delivery_date.startsWith(dateFilter));
        }
        setReceipts(filtered);
        return;
      }

      let query = supabase
        .from('receipts')
        .select('*')
        .order('delivery_date', { ascending: false });

      if (searchQuery) {
        query = query.or(`nf_number.ilike.%${searchQuery}%,receiver_name.ilike.%${searchQuery}%,product_description.ilike.%${searchQuery}%`);
      }

      if (dateFilter) {
        // Filtra pelo início e fim do dia selecionado
        const startOfDay = `${dateFilter}T00:00:00.000Z`;
        const endOfDay = `${dateFilter}T23:59:59.999Z`;
        query = query.gte('delivery_date', startOfDay).lte('delivery_date', endOfDay);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setReceipts(data || []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("Falha ao carregar registros. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReceipts();
    }, 300); // Debounce
    return () => clearTimeout(timer);
  }, [searchQuery, dateFilter]);

  return (
    <div className="flex flex-col min-h-screen bg-brand-dark animate-in fade-in duration-500">
      {/* Header Fixo */}
      <header className="sticky top-0 z-40 bg-brand-dark/90 backdrop-blur-xl border-b border-brand-border px-6 pt-6 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={onBack}
            className="p-2 bg-brand-surface border border-brand-border rounded-xl text-zinc-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Histórico de Cargas</h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Gestão de canhotos digitalizados</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="space-y-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-brand-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar por NF, Recebedor ou Produto..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-surface border border-brand-border rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-600 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-brand-primary pointer-events-none" />
              <input 
                type="date" 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border rounded-xl py-2 pl-11 pr-4 text-xs font-bold text-zinc-400 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all appearance-none"
              />
              {dateFilter && (
                <button 
                  onClick={() => setDateFilter('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-600 hover:text-white bg-brand-surface rounded-md"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="bg-brand-surface border border-brand-border px-3 py-2 rounded-xl flex items-center gap-2">
              <Filter className="w-3 h-3 text-brand-primary" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{receipts.length} Resultados</span>
            </div>
          </div>
        </div>
      </header>

      {/* Lista de Resultados */}
      <main className="flex-1 p-6 pb-32">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-brand-surface/50 border border-brand-border p-4 rounded-2xl animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
                    <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-20 flex flex-col items-center text-center px-8">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-white font-black">Ops! Algo deu errado</h3>
            <p className="text-zinc-500 text-sm mt-2">{error}</p>
            <button 
              onClick={fetchReceipts}
              className="mt-6 px-6 py-2 bg-brand-surface border border-brand-border rounded-xl text-zinc-400 font-bold hover:text-white"
            >
              Tentar Novamente
            </button>
          </div>
        ) : receipts.length === 0 ? (
          <div className="py-32 flex flex-col items-center text-center px-12 opacity-40">
            <PackageX className="w-16 h-16 text-zinc-700 mb-6" />
            <h3 className="text-zinc-400 font-black uppercase tracking-widest text-sm">Nenhum registro encontrado</h3>
            <p className="text-zinc-600 text-xs mt-2 font-medium">Refine seus filtros ou realize um novo escaneamento para popular o pátio.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {receipts.map((r) => (
              <div 
                key={r.id} 
                className="group bg-brand-surface border border-brand-border p-4 rounded-3xl flex items-center gap-4 active:scale-[0.98] hover:border-brand-primary/30 transition-all cursor-pointer relative overflow-hidden"
              >
                {/* Indicador de Tipo Lateral */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1",
                  r.content_type?.includes('pdf') ? 'bg-red-500' : 'bg-brand-primary'
                )}></div>

                {/* Ícone / Preview Mini */}
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105",
                  r.content_type?.includes('pdf') ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-brand-primary'
                )}>
                  {r.content_type?.includes('pdf') ? <FileText className="w-7 h-7" /> : <ImageIcon className="w-7 h-7" />}
                </div>

                {/* Info Principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-brand-primary font-black text-base leading-none tracking-tight">NF #{r.nf_number}</span>
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">
                      {new Date(r.delivery_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="text-white font-bold text-sm truncate">{r.receiver_name || 'Sem recebedor'}</h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-600" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        {new Date(r.delivery_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                    <span className="text-[10px] font-bold text-zinc-600 truncate italic">
                      {r.product_description || 'Sem descrição'}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-zinc-800 group-hover:text-brand-primary transition-colors" />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;
