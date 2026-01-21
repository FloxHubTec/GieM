
// Copyright © 2026 Floxhub. Todos os direitos reservados.
import React from 'react';
import { 
  Bell, Package, CheckCircle2, Clock, 
  ChevronRight, Home, Camera, History, Search, User
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DashboardProps {
  userName: string;
  onScanClick: () => void;
  onTabChange: (tab: 'dashboard' | 'history' | 'search' | 'profile') => void;
  activeTab: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userName, onScanClick, onTabChange, activeTab }) => {
  const recentDeliveries = [
    { id: '1', nf: '001245', status: 'Entregue', time: '14:30', receiver: 'Ricardo Silva' },
    { id: '2', nf: '003982', status: 'Em Rota', time: '11:15', receiver: 'Ana Paula' },
    { id: '3', nf: '004110', status: 'Pendente', time: '09:45', receiver: 'Manoel Gomes' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-brand-dark pb-32">
      <header className="sticky top-0 z-40 bg-brand-dark/80 backdrop-blur-md border-b border-brand-border px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-brand-primary p-1.5 rounded-lg">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white leading-none">GieM</h1>
            <p className="text-[8px] text-brand-primary uppercase font-black tracking-widest">Gestão Inteligente de Entrega</p>
          </div>
        </div>
        <button className="relative p-2 bg-brand-surface rounded-full border border-brand-border text-zinc-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full border-2 border-brand-dark"></span>
        </button>
      </header>

      <section className="px-6 pt-8 pb-4">
        <h2 className="text-2xl font-black text-white leading-tight">Olá, <span className="text-brand-primary">{userName}</span></h2>
        <p className="text-zinc-500 text-sm font-medium">Seu resumo de carga para hoje.</p>
      </section>

      <section className="px-6 py-4 grid grid-cols-2 gap-4">
        <div className="bg-brand-surface p-5 rounded-3xl border border-brand-border shadow-xl">
          <div className="bg-orange-500/10 w-10 h-10 rounded-2xl flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6 text-brand-primary" />
          </div>
          <p className="text-4xl font-black text-white">12</p>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Entregas Hoje</p>
        </div>
        <div className="bg-brand-surface p-5 rounded-3xl border border-brand-border shadow-xl">
          <div className="bg-zinc-800 w-10 h-10 rounded-2xl flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-zinc-400" />
          </div>
          <p className="text-4xl font-black text-white">142</p>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Total Mês</p>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em]">Atividade Recente</h3>
          <button className="text-brand-primary text-xs font-bold">Ver Tudo</button>
        </div>
        <div className="space-y-3">
          {recentDeliveries.map((item) => (
            <div key={item.id} className="bg-brand-surface border border-brand-border p-4 rounded-2xl flex items-center gap-4 group active:scale-95 transition-all">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                item.status === 'Entregue' ? 'bg-green-500/10 text-green-500' : 
                item.status === 'Em Rota' ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-800 text-zinc-500'
              )}>
                <Package className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="text-white font-bold text-sm truncate">NF #{item.nf}</h4>
                  <span className="text-[10px] font-black text-zinc-600">{item.time}</span>
                </div>
                <p className="text-zinc-500 text-xs truncate">{item.receiver}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    item.status === 'Entregue' ? 'bg-green-500' : 
                    item.status === 'Em Rota' ? 'bg-blue-500' : 'bg-zinc-600'
                  )}></div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{item.status}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-brand-primary transition-colors" />
            </div>
          ))}
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4 bg-brand-dark/95 backdrop-blur-lg border-t border-brand-border flex justify-between items-center">
        <button onClick={() => onTabChange('dashboard')} className={cn("flex flex-col items-center gap-1 px-3", activeTab === 'dashboard' ? 'text-brand-primary' : 'text-zinc-600')}><Home className="w-6 h-6" /><span className="text-[10px] font-black uppercase tracking-tighter">Início</span></button>
        <button onClick={() => onTabChange('history')} className={cn("flex flex-col items-center gap-1 px-3", activeTab === 'history' ? 'text-brand-primary' : 'text-zinc-600')}><History className="w-6 h-6" /><span className="text-[10px] font-black uppercase tracking-tighter">Histórico</span></button>
        <div className="relative -top-8">
          <button onClick={onScanClick} className="w-16 h-16 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-full shadow-2xl shadow-orange-500/40 flex items-center justify-center text-white active:scale-90 transition-transform border-4 border-brand-dark"><Camera className="w-8 h-8" /></button>
        </div>
        <button onClick={() => onTabChange('search')} className={cn("flex flex-col items-center gap-1 px-3", activeTab === 'search' ? 'text-brand-primary' : 'text-zinc-600')}><Search className="w-6 h-6" /><span className="text-[10px] font-black uppercase tracking-tighter">Busca</span></button>
        <button onClick={() => onTabChange('profile')} className={cn("flex flex-col items-center gap-1 px-3", activeTab === 'profile' ? 'text-brand-primary' : 'text-zinc-600')}><User className="w-6 h-6" /><span className="text-[10px] font-black uppercase tracking-tighter">Perfil</span></button>
      </nav>
    </div>
  );
};

export default Dashboard;
