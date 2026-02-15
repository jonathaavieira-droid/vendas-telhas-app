import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, MessageSquare, Quote, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Objections = () => {
    const { objections } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Todas');
    const [flippedId, setFlippedId] = useState(null);

    const categories = ['Todas', ...new Set(objections.map(o => o.category))];

    const filteredObjections = objections.filter(obj => {
        const matchesTab = activeTab === 'Todas' || obj.category === activeTab;
        const matchesSearch =
            obj.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            obj.a.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="space-y-8 animate-fade-in pb-24">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Matriz de Objeções 100</h1>
                    <p className="text-slate-400 mt-2 text-lg">Argumentação técnica de engenharia.</p>
                </div>

                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-secondary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Ex: ferrugem, preço, barulho..."
                        className="input pl-12 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-800">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`
              px-5 py-3 whitespace-nowrap font-bold transition-all relative
              ${activeTab === cat
                                ? 'text-secondary'
                                : 'text-slate-400 hover:text-white'
                            }
            `}
                    >
                        {cat}
                        {activeTab === cat && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-1 bg-secondary rounded-t-full shadow-glow"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Masonry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredObjections.map((obj) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={obj.id}
                            className={`
                relative h-auto min-h-[220px] perspective-1000 cursor-pointer group
              `}
                            onClick={() => setFlippedId(flippedId === obj.id ? null : obj.id)}
                        >
                            {/* Card Container */}
                            <div className={`
                relative w-full h-full p-6 rounded-2xl border transition-all duration-300 shadow-card
                ${flippedId === obj.id
                                    ? 'bg-secondary border-secondary text-black'
                                    : 'bg-surface border-slate-800 hover:border-secondary/50 hover:shadow-glow'
                                }
              `}>

                                <div className="flex justify-between items-start mb-4">
                                    <span className={`
                    text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider
                    ${flippedId === obj.id ? 'bg-black/20 text-black' : 'bg-slate-800 text-slate-400'}
                  `}>
                                        {obj.category}
                                    </span>
                                    {flippedId === obj.id ? <ShieldCheck className="text-black" /> : <Quote className="text-slate-600" />}
                                </div>

                                <h3 className={`
                  font-bold text-lg mb-4 leading-snug
                  ${flippedId === obj.id ? 'text-black' : 'text-primary'}
                `}>
                                    "{obj.q}"
                                </h3>

                                {/* Animated Content */}
                                <div className="relative overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        {flippedId === obj.id ? (
                                            <motion.div
                                                key="answer"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-sm leading-relaxed text-black/80 space-y-2 font-medium"
                                            >
                                                {/* Simple Parser for SENTIR/SENTIU/DESCOBRIU */}
                                                {obj.a.includes('SENTIR:') ? (
                                                    <>
                                                        <p><strong className="text-black">SENTIR:</strong> {obj.a.match(/SENTIR: (.*?)(?=SENTIU:|$)/)?.[1]}</p>
                                                        <p><strong className="text-black">SENTIU:</strong> {obj.a.match(/SENTIU: (.*?)(?=DESCOBRIU:|$)/)?.[1]}</p>
                                                        <p><strong className="text-black">DESCOBRIU:</strong> {obj.a.match(/DESCOBRIU: (.*)/)?.[1]}</p>
                                                    </>
                                                ) : (
                                                    <p>{obj.a}</p>
                                                )}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="cta"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="flex items-center gap-2 text-secondary font-bold text-sm mt-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <MessageSquare size={16} /> Ver Argumento
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredObjections.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-slate-600 text-lg">Nenhuma objeção encontrada para "{searchTerm}".</p>
                </div>
            )}
        </div>
    );
};

export default Objections;
