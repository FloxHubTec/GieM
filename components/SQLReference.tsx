
import React, { useState } from 'react';
import { Copy, Check, Terminal, Info } from 'lucide-react';

const SQLReference: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const sqlCode = `
-- TABELA PRINCIPAL
create table receipts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  nf_number text not null,
  receiver_name text,
  product_description text,
  delivery_date timestamptz,
  image_path text,
  content_type text,
  user_id uuid references auth.users(id) default auth.uid()
);

-- OTIMIZAÇÃO DE BUSCA
create index idx_receipts_nf_number on receipts(nf_number);
create index idx_receipts_receiver_name on receipts(receiver_name);
create index idx_receipts_delivery_date on receipts(delivery_date);

-- SEGURANÇA (RLS)
alter table receipts enable row level security;

create policy "Private User Access" 
on receipts for all 
using (auth.uid() = user_id);
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-brand-surface rounded-2xl shadow-2xl border border-brand-border overflow-hidden">
      <div className="p-8 border-b border-brand-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/30">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Terminal className="w-6 h-6 text-brand-primary" />
            Configuração Supabase
          </h2>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Provisione seu banco de dados para o GieM.</p>
        </div>
        <button 
          onClick={handleCopy}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg ${
            copied 
              ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
              : 'bg-brand-primary text-white hover:bg-orange-600 shadow-orange-950/20'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copiado!' : 'Copiar Script'}
        </button>
      </div>
      
      <div className="p-8 space-y-10">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-primary/10 text-brand-primary font-black text-xs border border-brand-primary/20">1</span>
            <h3 className="text-lg font-bold text-white tracking-tight">Esquema de Dados & Segurança</h3>
          </div>
          <p className="text-zinc-500 mb-4 text-sm font-medium">Execute no SQL Editor para criar a infraestrutura necessária:</p>
          <div className="relative group">
            <pre className="bg-brand-dark text-orange-500/90 p-6 rounded-2xl overflow-x-auto text-xs leading-relaxed font-mono border border-brand-border shadow-inner">
              {sqlCode}
            </pre>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-primary/10 text-brand-primary font-black text-xs border border-brand-primary/20">2</span>
            <h3 className="text-lg font-bold text-white tracking-tight">Armazenamento (Storage)</h3>
          </div>
          <div className="bg-orange-500/5 border border-brand-primary/10 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-brand-primary/10 rounded-lg mt-1">
                <Info className="w-5 h-5 text-brand-primary" />
              </div>
              <ol className="space-y-3 text-zinc-400 text-sm font-medium list-decimal list-inside">
                <li>Acesse a aba <strong className="text-white">Storage</strong> no Supabase.</li>
                <li>Crie um bucket chamado <code className="bg-brand-dark px-2 py-0.5 rounded text-brand-primary font-mono text-xs border border-brand-border">receipt-images</code>.</li>
                <li>Marque como <strong className="text-brand-primary">Public</strong> para facilitar o upload via frontend.</li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SQLReference;
