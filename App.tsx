
// Copyright © 2024 Floxhub. Todos os direitos reservados.
import React, { useState, useEffect } from 'react';
import { 
  Package, X, Search, History, 
  User, Home, Camera, Calendar
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Dashboard from './components/Dashboard';
import CaptureModal from './components/CaptureModal';
import HistoryPage from './components/HistoryPage';
import Login from './components/Login';
import AdminProfile from './components/AdminProfile';
import { UserProfile } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'search' | 'profile'>('dashboard');
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [searchDate, setSearchDate] = useState('');

  /**
   * Credenciais para o usuário testar:
   * Admin: diego@floxhub.com / admin
   * Operador: operador@floxhub.com / 1234
   */
  const handleLogin = async (email: string, pass: string) => {
    const lowerEmail = email.toLowerCase();
    
    // Admin Master: Diego
    if ((lowerEmail.includes('diego') || lowerEmail === 'admin@floxhub.com') && pass === 'admin') {
      setUser({
        id: '1',
        name: 'Diego Floxhub',
        email: email,
        phone: '(11) 98765-4321',
        role: 'admin'
      });
      setIsLoggedIn(true);
    } 
    // Operadores Comuns
    else if (pass === '1234') {
      setUser({
        id: '2',
        name: 'Operador Logístico',
        email: email,
        phone: '(11) 90000-0000',
        role: 'operator'
      });
      setIsLoggedIn(true);
    }
    else {
      throw new Error("Login ou senha inválidos.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setActiveTab('dashboard');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col selection:bg-brand-primary selection:text-white">
      
      <main className="flex-1 w-full">
        {activeTab === 'dashboard' && (
          <Dashboard 
            userName={user?.name.split(' ')[0] || 'Usuário'}
            onScanClick={() => setIsCaptureModalOpen(true)} 
            onTabChange={(tab) => setActiveTab(tab as any)}
            activeTab={activeTab}
          />
        )}

        {activeTab === 'history' && (
          <div className="min-h-screen">
            <HistoryPage onBack={() => setActiveTab('dashboard')} />
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onScanClick={() => setIsCaptureModalOpen(true)} />
          </div>
        )}

        {activeTab === 'search' && (
           <div className="p-6 pb-32 animate-in fade-in">
             <div className="mb-8">
               <h2 className="text-2xl font-black text-white tracking-tight">Localizar Cargas</h2>
               <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Busca avançada no servidor GieM</p>
             </div>
             
             <div className="space-y-4">
               <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brand-primary w-5 h-5 transition-colors" />
                 <input 
                  type="text" 
                  placeholder="NF, Cliente ou Produto..." 
                  className="w-full bg-brand-surface border border-brand-border rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all" 
                 />
               </div>

               <div className="relative group">
                 <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brand-primary w-5 h-5 transition-colors" />
                 <input 
                  type="date" 
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-border rounded-2xl py-4 pl-12 pr-4 text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-primary font-bold uppercase text-xs tracking-widest transition-all" 
                 />
               </div>
             </div>

             <div className="mt-12 text-center text-zinc-600">
               <Package className="w-12 h-12 mx-auto mb-4 opacity-10" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em]">Aguardando termo para consulta</p>
             </div>
             <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onScanClick={() => setIsCaptureModalOpen(true)} />
           </div>
        )}

        {activeTab === 'profile' && user && (
          <>
            <AdminProfile 
              user={user} 
              onLogout={handleLogout} 
            />
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onScanClick={() => setIsCaptureModalOpen(true)} />
          </>
        )}
      </main>

      <CaptureModal 
        isOpen={isCaptureModalOpen} 
        onClose={() => setIsCaptureModalOpen(false)} 
        onConfirm={() => {
          setIsCaptureModalOpen(false);
          setActiveTab('history');
        }} 
      />
    </div>
  );
};

const BottomNav: React.FC<{activeTab: string, onTabChange: (tab: any) => void, onScanClick: () => void}> = ({ activeTab, onTabChange, onScanClick }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4 bg-brand-dark/95 backdrop-blur-lg border-t border-brand-border flex justify-between items-center">
      <button onClick={() => onTabChange('dashboard')} className={cn("flex flex-col items-center gap-1 px-3", activeTab === 'dashboard' ? 'text-brand-primary' : 'text-zinc-600')}><Home className="w-6 h-6" /><span className="text-[10px] font-black uppercase tracking-tighter">Início</span></button>
      <button onClick={() => onTabChange('history')} className={cn("flex flex-col items-center gap-1 px-3", activeTab === 'history' ? 'text-brand-primary' : 'text-zinc-600')}><History className="w-6 h-6" /><span className="text-[10px] font-black uppercase tracking-tighter">Histórico</span></button>
      <div className="relative -top-8">
        <button onClick={onScanClick} className="w-16 h-16 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-full shadow-2xl shadow-orange-500/40 flex items-center justify-center text-white border-4 border-brand-dark transition-transform active:scale-90"><Camera className="w-8 h-8" /></button>
      </div>
      <button onClick={() => onTabChange('search')} className={cn("flex flex-col items-center gap-1 px-3", activeTab === 'search' ? 'text-brand-primary' : 'text-zinc-600')}><Search className="w-6 h-6" /><span className="text-[10px] font-black uppercase tracking-tighter">Busca</span></button>
      <button onClick={() => onTabChange('profile')} className={cn("flex flex-col items-center gap-1 px-3", activeTab === 'profile' ? 'text-brand-primary' : 'text-zinc-600')}><User className="w-6 h-6" /><span className="text-[10px] font-black uppercase tracking-tighter">Perfil</span></button>
    </nav>
  );
};

export default App;
