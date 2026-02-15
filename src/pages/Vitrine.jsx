import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, Share2, Info, Target, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductCardCarousel = ({ images, category, onClick }) => {
    const [current, setCurrent] = useState(0);

    const next = (e) => {
        e.stopPropagation();
        setCurrent((prev) => (prev + 1) % images.length);
    };

    const prev = (e) => {
        e.stopPropagation();
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="relative h-56 overflow-hidden bg-slate-800 group" onClick={onClick}>
            {images.length > 0 ? (
                <img
                    src={images[current]}
                    alt="Product"
                    className="w-full h-full object-cover transition-transform duration-700 opacity-90 group-hover:opacity-100 group-hover:scale-105"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">No Image</div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10 z-10">
                {category}
            </span>

            {/* Controls */}
            {images.length > 1 && (
                <>
                    <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/80">
                        <ChevronLeft size={16} />
                    </button>
                    <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/80">
                        <ChevronRight size={16} />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                        {images.map((_, idx) => (
                            <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === current ? 'bg-secondary' : 'bg-white/50'}`} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const Vitrine = () => {
    const { products } = useStore();
    const [filter, setFilter] = useState('Todas');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('details');

    // Helper to safely get images array
    const getImages = (product) => {
        let imgs = product.images;
        // Handle potential JSON string from DB
        if (typeof imgs === 'string') {
            try {
                imgs = JSON.parse(imgs);
            } catch (e) {
                console.error("Error parsing images JSON", e);
                imgs = null;
            }
        }
        // Fallback to legacy img if array is invalid/empty
        if (!Array.isArray(imgs) || imgs.length === 0) {
            return product.img ? [product.img] : [];
        }
        return imgs;
    };

    // Modal Carousel State
    const [modalImageIndex, setModalImageIndex] = useState(0);

    const categories = ['Todas', 'Cobertura', 'Estrutura', 'Acabamento'];

    const filteredProducts = products.filter(p => {
        const matchesCategory = filter === 'Todas' || p.category === filter;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setModalImageIndex(0);
        setActiveTab('details');
    };

    const handleShare = (product) => {
        const text = `Olá! Segue o detalhe técnico do produto: *${product.name}* \n\n${product.desc}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleDownload = (imageUrl, name) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${name.replace(/\s+/g, '_')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const parseCavaben = (text) => {
        if (!text) return { feat: '', adv: '', ben: '' };
        const cleanText = text.replace(/\\n/g, '\n').replace(/\*\*/g, '');
        const getPart = (key) => {
            const regex = new RegExp(`${key}:\\s*([\\s\\S]*?)(?=(?:CARACTERÍSTICA|VANTAGEM|BENEFÍCIO):|$)`, 'i');
            const match = cleanText.match(regex);
            return match ? match[1].trim() : null;
        };
        return {
            feat: getPart('CARACTERÍSTICA') || getPart('CARACTERISTICA'),
            adv: getPart('VANTAGEM'),
            ben: getPart('BENEFÍCIO') || getPart('BENEFICIO')
        };
    };

    const nextModalImage = () => {
        if (!selectedProduct) return;
        const imgs = getImages(selectedProduct);
        setModalImageIndex((prev) => (prev + 1) % imgs.length);
    };

    const prevModalImage = () => {
        if (!selectedProduct) return;
        const imgs = getImages(selectedProduct);
        setModalImageIndex((prev) => (prev - 1 + imgs.length) % imgs.length);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-24 relative">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Vitrine Técnica</h1>
                    <p className="text-slate-400 mt-2 text-lg">Catálogo interativo para demonstração.</p>
                </div>

                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-secondary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        className="input pl-12 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`
              px-6 py-2.5 rounded-xl whitespace-nowrap font-bold tracking-wide transition-all duration-300
              ${filter === cat
                                ? 'bg-secondary text-black shadow-glow scale-105'
                                : 'bg-surface text-slate-400 hover:bg-slate-800 border border-slate-700 hover:border-slate-600'
                            }
            `}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence>
                    {filteredProducts.map(product => {
                        const images = getImages(product);
                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={product.id}
                                className="card group cursor-pointer overflow-hidden flex flex-col h-full relative"
                            >
                                <ProductCardCarousel
                                    images={images}
                                    category={product.category}
                                    onClick={() => handleOpenModal(product)}
                                />

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col" onClick={() => handleOpenModal(product)}>
                                    <h3 className="font-bold text-xl mb-3 text-white group-hover:text-secondary transition-colors leading-tight">
                                        {product.name}
                                    </h3>
                                    <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                        {product.desc}
                                    </p>

                                    <div className="flex gap-3 mt-auto pt-4 border-t border-slate-800">
                                        <button className="flex-1 btn btn-outline text-xs py-2">
                                            <Info size={16} /> Detalhes
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>

            {/* Product Modal */}
            {selectedProduct && (() => {
                const images = getImages(selectedProduct);
                const currentImg = images[modalImageIndex] || images[0]; // Safety fallback

                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedProduct(null)}>
                        <div className="bg-surface w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden relative" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors">
                                <X size={20} />
                            </button>

                            {/* Modal Header / Carousel */}
                            <div className="h-72 relative bg-slate-900 group">
                                <img
                                    src={currentImg}
                                    className="w-full h-full object-cover opacity-90 transition-opacity duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />

                                {/* Controls */}
                                {images.length > 1 && (
                                    <>
                                        <button onClick={prevModalImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/70 transition-colors z-10">
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button onClick={nextModalImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/70 transition-colors z-10">
                                            <ChevronRight size={24} />
                                        </button>
                                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                            {images.map((_, idx) => (
                                                <div key={idx} className={`w-2 h-2 rounded-full transition-colors ${idx === modalImageIndex ? 'bg-secondary' : 'bg-white/50'}`} />
                                            ))}
                                        </div>
                                    </>
                                )}

                                <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                                    <div>
                                        <span className="text-secondary font-bold text-xs tracking-widest uppercase bg-black/50 px-2 py-1 rounded backdrop-blur-sm mb-2 inline-block">
                                            {selectedProduct.category}
                                        </span>
                                        <h2 className="text-3xl font-bold text-white shadow-black drop-shadow-lg leading-tight">{selectedProduct.name}</h2>
                                    </div>
                                    <button
                                        onClick={() => handleDownload(currentImg, selectedProduct.name)}
                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-sm transition-colors mb-1"
                                        title="Baixar Imagem"
                                    >
                                        <Download size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Tabs Container */}
                                <div className="flex gap-6 border-b border-slate-700 mb-6">
                                    <button
                                        onClick={() => setActiveTab('details')}
                                        className={`pb-2 font-bold cursor-pointer transition-colors ${activeTab === 'details' ? 'border-b-2 border-secondary text-secondary' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        Detalhes
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('cavaben')}
                                        className={`pb-2 font-bold cursor-pointer transition-colors flex items-center gap-2 ${activeTab === 'cavaben' ? 'border-b-2 border-secondary text-secondary' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        Argumentos de Venda (CAVABEN)
                                        {selectedProduct.cavaben && <span className="w-2 h-2 rounded-full bg-secondary block" />}
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="space-y-6 max-h-[35vh] overflow-y-auto custom-scrollbar pr-2">
                                    {activeTab === 'details' ? (
                                        <div className="animate-fade-in">
                                            <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                                <Info size={18} className="text-secondary" />
                                                Descrição Técnica
                                            </h3>
                                            <p className="text-slate-400 leading-relaxed text-sm whitespace-pre-line">
                                                {selectedProduct.desc}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="animate-fade-in">
                                            {selectedProduct.cavaben ? (() => {
                                                const { feat, adv, ben } = parseCavaben(selectedProduct.cavaben);
                                                return (
                                                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                                                        <h3 className="text-secondary font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
                                                            <Target size={18} />
                                                            Argumentos de Venda (CAVABEN)
                                                        </h3>

                                                        <div className="space-y-8">
                                                            {/* Feature Step */}
                                                            <div className="flex gap-4 group">
                                                                <div className="flex-shrink-0 mt-1 relative">
                                                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30 group-hover:bg-blue-500 group-hover:text-black transition-colors">C</div>
                                                                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-800 -z-10" />
                                                                </div>
                                                                <div className="pb-4">
                                                                    <span className="text-blue-400 font-bold text-xs uppercase block mb-1">Característica (O que é?)</span>
                                                                    {feat ? (
                                                                        <p className="text-white text-base leading-relaxed">{feat}</p>
                                                                    ) : (
                                                                        <span className="text-slate-500 text-sm italic">Não informado...</span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Advantage Step */}
                                                            <div className="flex gap-4 group">
                                                                <div className="flex-shrink-0 mt-1 relative">
                                                                    <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center font-bold text-xs border border-green-500/30 group-hover:bg-green-500 group-hover:text-black transition-colors">V</div>
                                                                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-800 -z-10" />
                                                                </div>
                                                                <div className="pb-4">
                                                                    <span className="text-green-400 font-bold text-xs uppercase block mb-1">Vantagem (O que faz?)</span>
                                                                    {adv ? (
                                                                        <p className="text-white text-base leading-relaxed">{adv}</p>
                                                                    ) : (
                                                                        <span className="text-slate-500 text-sm italic">Não informado...</span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Benefit Step */}
                                                            <div className="flex gap-4 group">
                                                                <div className="flex-shrink-0 mt-1">
                                                                    <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-xs border border-orange-500/30 group-hover:bg-orange-500 group-hover:text-black transition-colors">B</div>
                                                                </div>
                                                                <div>
                                                                    <span className="text-orange-400 font-bold text-xs uppercase block mb-1">Benefício (O que ganho?)</span>
                                                                    {ben ? (
                                                                        <p className="text-white text-base leading-relaxed">{ben}</p>
                                                                    ) : (
                                                                        <span className="text-slate-500 text-sm italic">Não informado...</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })() : (
                                                <div className="text-center py-12 text-slate-500 flex flex-col items-center">
                                                    <div className="bg-slate-800 p-4 rounded-full mb-3">
                                                        <Target size={24} className="opacity-50" />
                                                    </div>
                                                    <p>Nenhum argumento cadastrado.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
                                    <button onClick={() => handleShare(selectedProduct)} className="btn btn-primary w-full md:w-auto">
                                        <Share2 size={18} /> Compartilhar Detalhes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default Vitrine;
