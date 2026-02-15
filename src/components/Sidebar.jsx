import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingBag, MessageSquareText, Settings, Menu, X, HardHat, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, role, signOut, isAdmin, loading } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Tarefas Diárias', path: '/' },
        { icon: ShoppingBag, label: 'Vitrine', path: '/vitrine' },
        { icon: MessageSquareText, label: 'Objeções', path: '/objections' },
        ...(isAdmin ? [{ icon: Settings, label: 'Admin', path: '/admin' }] : []), // Hide Admin if not admin
    ];

    return (
        <>
            {/* Mobile Toggle */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface border-b border-slate-800 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-2 text-secondary">
                    <HardHat size={24} />
                    <span className="font-bold tracking-tighter text-white">Onbord<span className="text-secondary">Aço</span></span>
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar Container */}
            <AnimatePresence>
                {(isOpen || window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        className={`
              fixed md:static inset-y-0 left-0 z-40 w-64 bg-surface border-r border-slate-800 flex flex-col
              ${isOpen ? 'block' : 'hidden md:flex'}
            `}
                    >
                        {/* Logo Area */}
                        <div className="h-20 flex items-center px-8 border-b border-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="bg-secondary p-1.5 rounded text-black">
                                    <HardHat size={20} />
                                </div>
                                <div>
                                    <h1 className="font-black text-lg tracking-tighter text-white leading-none">
                                        Onbord<span className="text-secondary">Aço</span>
                                    </h1>
                                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">por Jonatha Vieira</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 py-8 space-y-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden
                    ${isActive
                                            ? 'bg-secondary text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }
                  `}
                                >
                                    <item.icon size={20} className="relative z-10" />
                                    <span className="relative z-10 text-sm tracking-wide">{item.label}</span>

                                </NavLink>
                            ))}
                        </nav>

                        {/* User Info / Footer */}
                        <div className="p-4 border-t border-slate-800">
                            <div className="bg-black/30 rounded-lg p-3 flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
                                    {user?.email?.charAt(0) || 'U'}
                                </div>
                                <div className="overflow-hidden">
                                    <div className="text-xs font-bold text-slate-300 truncate w-32">{user?.email?.split('@')[0]}</div>
                                    <div className="text-[10px] text-secondary flex items-center gap-1 uppercase font-bold tracking-wider">
                                        {isAdmin ? 'ADMIN' : role === 'supervisor' ? 'SUPERVISOR' : role === 'manager' ? 'GERENTE' : role === 'vendor' ? 'VENDEDOR' : (role || 'VENDEDOR')}
                                    </div>
                                    <div className="text-[8px] text-slate-600 font-mono mt-1">
                                        ID: {user?.id?.slice(0, 8)}... | {loading ? 'Carregando...' : 'Pronto'}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={signOut}
                                className="w-full flex items-center justify-center gap-2 text-xs text-red-400 hover:text-white hover:bg-red-500/20 py-2 rounded transition-colors"
                            >
                                <LogOut size={14} /> Sair
                            </button>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
