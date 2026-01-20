
// Copyright © 2024 Floxhub. Todos os direitos reservados.
import React, { useState } from 'react';
import { 
  User, Mail, Phone, LogOut, ShieldCheck, UserPlus, Trash2, ShieldAlert
} from 'lucide-react';
import { UserProfile } from '../../types';

interface AdminProfileProps {
  user: UserProfile;
  onLogout: () => void;
}

const AdminProfile: React.FC<AdminProfileProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'users'>('info');
  const isAdmin = user.role === 'admin';

  const mockUsers = [
    { id: '1', name: 'Carlos Lima', email: 'carlos@gie.com', role: 'operator' },
    { id: '2', name: 'Juliana Dias', email: 'juliana@gie.com', role: 'operator' },
  ];

  return (
    <div className="p-6 pb-32 animate-in slide-in-from-right duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-white tracking-tight">Perfil de {isAdmin ? 'Gestão' : 'Operador'}</h2>
        <button onClick={onLogout} className="p-2 bg-red-500/10 text-red-500 rounded-xl active:scale-95 transition-transform">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Cartão de Identidade */}
      <div className="bg-brand-surface border border-brand-border rounded-3xl p-6 flex items-center gap-4 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl"></div>
        <div className="w-20 h-20 bg-gradient-to-tr from-brand-primary to-orange-400 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-orange-500/20 relative z-10">
          {user.name.charAt(0)}
        </div>
        <div className="relative z-10">
          <h3 className="text-white font-black text-xl leading-tight">{user.name}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            {isAdmin ? (
              <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
            ) : (
              <User className="w-3.5 h-3.5 text-zinc-500" />
            )}
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
              {isAdmin ? 'Administrador Master' : 'Operador de Carga'}
            </span>
          </div>
        </div>
      </div>

      {/* Navegação entre abas exclusiva para Administrador */}
      {isAdmin && (
        <div className="flex bg-brand-surface p-1 rounded-2xl border border-brand-border mb-6">
          <button 
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'info' ? 'bg-brand-dark text-brand-primary shadow-lg' : 'text-zinc-600'}`}
          >
            Meus Dados
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-brand-dark text-brand-primary shadow-lg' : 'text-zinc-600'}`}
          >
            Gerenciar Equipe
          </button>
        </div>
      )}

      {activeTab === 'info' ? (
        <div className="space-y-4">
          <div className="bg-brand-surface border border-brand-border p-4 rounded-2xl space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-zinc-800 rounded-lg text-zinc-500"><Mail className="w-4 h-4" /></div>
              <div>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Email Corporativo</p>
                <p className="text-zinc-200 font-bold text-sm">{user.email}</p>
              </div>
            </div>
            <div className="h-px bg-brand-border"></div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-zinc-800 rounded-lg text-zinc-500"><Phone className="w-4 h-4" /></div>
              <div>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Telefone de Contato</p>
                <p className="text-zinc-200 font-bold text-sm">{user.phone}</p>
              </div>
            </div>
          </div>

          {!isAdmin && (
            <div className="p-6 bg-zinc-900/50 border border-brand-border rounded-2xl flex flex-col items-center text-center gap-3">
              <ShieldAlert className="w-8 h-8 text-zinc-700" />
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                Acesso restrito. Entre em contato com o suporte Diego para alterar suas permissões.
              </p>
            </div>
          )}
        </div>
      ) : (
        isAdmin && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            <button className="w-full py-4 border-2 border-dashed border-brand-border rounded-2xl flex items-center justify-center gap-2 text-zinc-500 hover:text-brand-primary hover:border-brand-primary transition-all group">
              <UserPlus className="w-5 h-5" />
              <span className="font-black text-xs uppercase tracking-widest">Adicionar Novo Operador</span>
            </button>

            <div className="space-y-3">
              {mockUsers.map(u => (
                <div key={u.id} className="bg-brand-surface border border-brand-border p-4 rounded-2xl flex items-center justify-between group hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 font-bold group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{u.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Operador GieM</p>
                    </div>
                  </div>
                  <button className="p-2 text-zinc-700 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      )}
      
      <div className="mt-12 text-center opacity-20">
        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-500">Powered by Floxhub Architecture</p>
      </div>
    </div>
  );
};

export default AdminProfile;
