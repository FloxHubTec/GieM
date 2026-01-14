
// Copyright © 2024 Floxhub. Todos os direitos reservados.
import React, { useState } from 'react';
import { Lock, Mail, Loader2, Package } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, pass: string) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError("Credenciais inválidas. Verifique seus dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="inline-flex bg-brand-primary p-3 rounded-2xl shadow-2xl shadow-orange-500/20 mb-4">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">GieM</h1>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.2em] mt-2">Gestão Inteligente de Entrega</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-brand-surface p-8 rounded-3xl border border-brand-border space-y-5 shadow-2xl">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email de Acesso</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-brand-primary transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@empresa.com"
                className="w-full bg-brand-dark border border-brand-border rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Senha</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-brand-primary transition-colors" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-dark border border-brand-border rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center animate-pulse">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-brand-primary text-white font-black rounded-xl shadow-xl shadow-orange-900/20 hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar no Sistema"}
          </button>
        </form>

        <p className="text-center text-zinc-700 text-[10px] font-black uppercase tracking-widest">
          Desenvolvido por Floxhub © 2024
        </p>
      </div>
    </div>
  );
};

export default Login;
