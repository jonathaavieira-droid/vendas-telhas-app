import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { HardHat, LogIn, AlertCircle, Plus } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error: authError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (authError) throw authError;
                navigate('/');
            } else {
                const { data, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (authError) throw authError;
                if (data.user && !data.session) {
                    setError("Cadastro realizado! Verifique seu email para confirmar.");
                    setIsLogin(true);
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            setError(err.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : "Erro: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-surface border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                {/* Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="flex flex-col items-center mb-8 relative z-10">
                    <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-black mb-4 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                        <HardHat size={32} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter">Onbord<span className="text-secondary">Aço</span></h1>
                    <p className="text-slate-500 font-medium">Acesse sua conta para continuar</p>
                    <p className="text-[10px] text-slate-600 mt-1">Desenvolvido por Jonatha Vieira</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4 relative z-10">
                    {error && (
                        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${error.includes('sucesso') ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">E-mail Corporativo</label>
                        <input
                            type="email"
                            required
                            className="input w-full bg-black/50 border-slate-700 focus:border-secondary h-12"
                            placeholder="seu.nome@empresa.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Senha</label>
                        <input
                            type="password"
                            required
                            className="input w-full bg-black/50 border-slate-700 focus:border-secondary h-12"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full h-12 text-lg font-bold shadow-glow mt-4"
                    >
                        {loading ? 'Processando...' : (isLogin ? <><LogIn size={20} /> Entrar no Sistema</> : <><Plus size={20} /> Criar Nova Conta</>)}
                    </button>

                    <div className="flex flex-col gap-2 mt-6 text-center">
                        <p className="text-xs text-slate-600 cursor-pointer hover:text-white transition-colors" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Primeiro acesso? Clique aqui para CADASTRAR' : 'Já tem conta? Clique aqui para ENTRAR'}
                        </p>
                        {isLogin && (
                            <p className="text-xs text-slate-700">
                                Esqueceu a senha? Contate o Administrador.
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
