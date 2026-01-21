import React, { useState } from 'react'
import { Lock, Mail, Loader2, Package } from 'lucide-react'

interface LoginProps {
  onLogin: (email: string, pass: string) => Promise<void>
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await onLogin(email, password)
    } catch {
      setError('Credenciais inválidas. Verifique seus dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in duration-700">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex bg-brand-primary p-3 rounded-2xl shadow-2xl shadow-orange-500/20 mb-4">
            <Package className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl font-black text-white tracking-tight">GieM</h1>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            Gestão Inteligente de Entrega
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-brand-surface border border-brand-border rounded-3xl p-8 space-y-5 shadow-2xl"
        >
          {/* Email */}
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Email de acesso
            </label>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-brand-primary transition" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nome@empresa.com"
                className="w-full rounded-xl bg-brand-dark border border-brand-border py-3.5 pl-11 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Senha
            </label>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-brand-primary transition" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-brand-dark border border-brand-border py-3.5 pl-11 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              />
            </div>
          </div>

          {error && (
            <p className="text-center text-xs font-bold text-red-500 animate-pulse">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-brand-primary text-white font-black shadow-xl shadow-orange-900/20 hover:brightness-110 transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar no Sistema'}
          </button>
        </form>

        <p className="text-center text-[10px] font-black uppercase tracking-widest text-zinc-700">
          Desenvolvido por Floxhub © 2026
        </p>
      </div>
    </div>
  )
}

export default Login
