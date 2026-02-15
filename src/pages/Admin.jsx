import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Upload, Pencil, Image as ImageIcon, Database, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [loading, setLoading] = useState(false);

    // Data State
    const [products, setProducts] = useState([]);
    const [objections, setObjections] = useState([]);

    // Form States
    const [prodForm, setProdForm] = useState({
        name: '',
        category: 'Cobertura',
        desc: '',
        cavaben: '',
        img: '',
        images: [] // Array of image URLs
    });
    const [objForm, setObjForm] = useState({ category: 'Custo', q: '', a: '' });
    const [uploading, setUploading] = useState(false);

    // Edit State
    const [editingId, setEditingId] = useState(null);

    // Initial Load
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data: p } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        const { data: o } = await supabase.from('objections').select('*').order('created_at', { ascending: false });
        if (p) setProducts(p);
        if (o) setObjections(o);
        setLoading(false);
    };

    // --- Actions ---

    const handleEdit = (item, type) => {
        setEditingId(item.id);
        if (type === 'products') {
            setProdForm({
                name: item.name,
                category: item.category,
                desc: item.descr || item.desc || '',
                cavaben: item.cavaben || '',
                img: item.img || '',
                images: item.images || (item.img ? [item.img] : []) // Fallback for legacy
            });
            setActiveTab('products');
        } else {
            setObjForm({
                category: item.category,
                q: item.q,
                a: item.a
            });
            setActiveTab('objections');
        }
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setProdForm({ name: '', category: 'Cobertura', desc: '', cavaben: '', img: '', images: [] });
        setObjForm({ category: 'Custo', q: '', a: '' });
    };

    // Image Upload
    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            const newImages = [];

            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error } = await supabase.storage
                    .from('images')
                    .upload(filePath, file);

                if (error) {
                    console.error('Upload error:', error);
                    continue;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('images')
                    .getPublicUrl(filePath);

                newImages.push(publicUrl);
            }

            // Update form: Add new images to array
            // Also set main 'img' to the first one if empty
            const updatedImages = [...prodForm.images, ...newImages];
            setProdForm(prev => ({
                ...prev,
                images: updatedImages,
                img: prev.img || updatedImages[0]
            }));

        } catch (error) {
            console.error(error);
            alert('Erro no upload.');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (indexToRemove) => {
        const updatedImages = prodForm.images.filter((_, i) => i !== indexToRemove);
        setProdForm(prev => ({
            ...prev,
            images: updatedImages,
            img: updatedImages.length > 0 ? updatedImages[0] : '' // Reset main img if empty
        }));
    };

    const handleSaveProduct = async () => {
        if (!prodForm.name) return;

        let error;
        const payload = {
            name: prodForm.name,
            category: prodForm.category,
            descr: prodForm.desc,
            cavaben: prodForm.cavaben,
            img: prodForm.images[0] || prodForm.img, // Prefer first image of array
            images: prodForm.images
        };

        if (editingId) {
            // Update
            const { error: err } = await supabase
                .from('products')
                .update(payload)
                .eq('id', editingId);
            error = err;
        } else {
            // Insert
            const { error: err } = await supabase.from('products').insert([payload]);
            error = err;
        }

        if (error) alert('Erro ao salvar produto: ' + error.message);
        else {
            handleCancelEdit(); // Reset form
            fetchData();
        }
    };

    const handleSaveObjection = async () => {
        if (!objForm.q) return;

        let error;

        if (editingId) {
            const { error: err } = await supabase
                .from('objections')
                .update({
                    category: objForm.category,
                    q: objForm.q,
                    a: objForm.a
                })
                .eq('id', editingId);
            error = err;
        } else {
            const { error: err } = await supabase.from('objections').insert([objForm]);
            error = err;
        }

        if (error) alert('Erro ao salvar objeção');
        else {
            handleCancelEdit(); // Reset form
            fetchData();
        }
    };

    const handleDelete = async (table, id) => {
        if (!confirm('Tem certeza?')) return;
        await supabase.from(table).delete().eq('id', id);
        fetchData();
    };

    // --- Users Logic ---
    const [users, setUsers] = useState([]);
    const [updatingUser, setUpdatingUser] = useState(null);

    const fetchUsers = async () => {
        const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (data) setUsers(data);
    };

    const handleUpdateRole = async (userId, newRole) => {
        setUpdatingUser(userId);
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) alert('Erro ao atualizar cargo: ' + error.message);
        else {
            fetchUsers(); // Refresh list
        }
        setUpdatingUser(null);
    };

    // Update Initial Fetch
    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            await fetchData();
            await fetchUsers(); // Fetch users too
            setLoading(false);
        };
        loadAll();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in pb-24">
            <div className="flex justify-between items-center">
                <header>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Admin & CRM</h1>
                    <p className="text-slate-400 mt-2 text-lg">Gerencie o conteúdo e a equipe.</p>
                </header>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-700 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`pb-4 px-4 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'products' ? 'border-secondary text-secondary' : 'border-transparent text-slate-500 hover:text-white'}`}
                >
                    Produtos
                </button>
                <button
                    onClick={() => setActiveTab('objections')}
                    className={`pb-4 px-4 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'objections' ? 'border-secondary text-secondary' : 'border-transparent text-slate-500 hover:text-white'}`}
                >
                    Objeções
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`pb-4 px-4 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'users' ? 'border-secondary text-secondary' : 'border-transparent text-slate-500 hover:text-white'}`}
                >
                    Usuários da Equipe
                </button>
            </div>

            {/* Content Switch */}
            {activeTab === 'users' ? (
                <div className="bg-surface p-6 rounded-xl border border-slate-700">
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-white">Gerenciar Equipe</h2>
                            <p className="text-slate-400 text-sm">Defina os cargos de acesso para cada usuário cadastrado.</p>
                        </div>
                        <div className="text-xs text-orange-400 bg-orange-400/10 px-3 py-2 rounded-lg border border-orange-400/20 max-w-md">
                            <strong>Como adicionar novos?</strong><br />
                            Peça para o novo membro se cadastrar na tela de Login normal.<br />
                            Assim que ele criar a conta, aparecerá nesta lista como "Vendor" (Vendedor).
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-700 text-slate-400 text-sm uppercase tracking-wider">
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Data Cadastro</th>
                                    <th className="p-4">Cargo Atual</th>
                                    <th className="p-4">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-300">
                                {users.map(u => (
                                    <tr key={u.id} className="border-b border-slate-800 hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono text-sm text-white">{u.email}</td>
                                        <td className="p-4 text-sm">{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                                        <td className="p-4">
                                            <span className={`
                                                px-2 py-1 rounded text-xs font-bold uppercase
                                                ${u.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                                                    u.role === 'manager' ? 'bg-purple-500/20 text-purple-400' :
                                                        u.role === 'supervisor' ? 'bg-blue-500/20 text-blue-400' :
                                                            'bg-green-500/20 text-green-400'}
                                            `}>
                                                {u.role === 'vendor' ? 'VENDEDOR' : u.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <select
                                                className="bg-black border border-slate-700 rounded px-2 py-1 text-sm focus:border-secondary outline-none"
                                                value={u.role}
                                                onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                                                disabled={updatingUser === u.id}
                                            >
                                                <option value="vendor">Vendedor</option>
                                                <option value="supervisor">Supervisor</option>
                                                <option value="manager">Gerente</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            {updatingUser === u.id && <span className="ml-2 text-xs text-secondary animate-pulse">Salvando...</span>}
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-slate-500">Nenhum usuário encontrado.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Reuse existing Product/Objection Form & List Logic */}
                    {/* Form Section */}
                    <div className={`p-6 rounded-xl border shadow-card h-fit sticky top-6 transition-colors ${editingId ? 'bg-secondary/10 border-secondary' : 'bg-surface border-slate-700'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                {editingId ? <Pencil size={20} className="text-secondary" /> : <Plus size={20} className="text-secondary" />}
                                {editingId ? 'Editando Item' : (activeTab === 'products' ? 'Novo Produto' : 'Nova Objeção')}
                            </h2>
                            {editingId && (
                                <button onClick={handleCancelEdit} className="text-xs text-red-400 hover:underline">
                                    Cancelar Edição
                                </button>
                            )}
                        </div>

                        {activeTab === 'products' ? (
                            <div className="space-y-4">
                                <input
                                    className="input"
                                    placeholder="Nome do Produto"
                                    value={prodForm.name}
                                    onChange={e => setProdForm({ ...prodForm, name: e.target.value })}
                                />
                                <select
                                    className="input"
                                    value={prodForm.category}
                                    onChange={e => setProdForm({ ...prodForm, category: e.target.value })}
                                >
                                    <option value="Cobertura">Cobertura</option>
                                    <option value="Estrutura">Estrutura</option>
                                    <option value="Acabamento">Acabamento</option>
                                    <option value="Fixação">Fixação</option>
                                </select>
                                <textarea
                                    className="input min-h-[80px]"
                                    placeholder="Descrição Técnica..."
                                    value={prodForm.desc}
                                    onChange={e => setProdForm({ ...prodForm, desc: e.target.value })}
                                />
                                <textarea
                                    className="input min-h-[100px] border-secondary/30 focus:border-secondary"
                                    placeholder="CAVABEN (Característica, Vantagem, Benefício)...&#10;Ex: CARACTERÍSTICA: Aço Galvalume.&#10;VANTAGEM: Não enferruja.&#10;BENEFÍCIO: Obra dura 30 anos."
                                    value={prodForm.cavaben}
                                    onChange={e => setProdForm({ ...prodForm, cavaben: e.target.value })}
                                />

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">Imagens do Produto</label>
                                    <div className="flex gap-2">
                                        <label className="btn btn-secondary cursor-pointer flex-1 flex justify-center items-center gap-2">
                                            {uploading ? 'Enviando...' : <><Upload size={18} /> Escolher Arquivos (Múltiplos)</>}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-4 gap-2 mt-4">
                                        {prodForm.images.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square group">
                                                <img src={img} className="w-full h-full object-cover rounded-lg border border-slate-700" />
                                                <button
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <input
                                        className="input text-xs font-mono text-slate-500 mt-2"
                                        placeholder="Ou cole uma URL..."
                                        value={prodForm.img}
                                        onChange={e => setProdForm({ ...prodForm, img: e.target.value, images: [...prodForm.images, e.target.value] })}
                                    />
                                </div>

                                <button onClick={handleSaveProduct} className="btn btn-primary w-full mt-4" disabled={loading || uploading}>
                                    {editingId ? 'Atualizar Produto' : <><Save size={20} /> Salvar Produto</>}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <select
                                    className="input"
                                    value={objForm.category}
                                    onChange={e => setObjForm({ ...objForm, category: e.target.value })}
                                >
                                    <option value="Custo">Custo</option>
                                    <option value="Durabilidade">Durabilidade</option>
                                    <option value="Conforto">Conforto</option>
                                    <option value="Prazo">Prazo</option>
                                    <option value="Concorrência">Concorrência</option>
                                </select>
                                <input
                                    className="input"
                                    placeholder="Objeção (Ex: Está caro...)"
                                    value={objForm.q}
                                    onChange={e => setObjForm({ ...objForm, q: e.target.value })}
                                />
                                <div className="relative">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs font-bold text-slate-400">Resposta Ideal</label>
                                        <span className="text-[10px] text-slate-500 bg-black/50 px-2 py-0.5 rounded">
                                            Use: SENTIR / SENTIU / DESCOBRIU
                                        </span>
                                    </div>
                                    <textarea
                                        className="input min-h-[200px] font-mono text-sm leading-relaxed"
                                        placeholder={`SENTIR: Entendo que...&#10;SENTIU: Outro cliente achava...&#10;DESCOBRIU: Mas ele viu que...`}
                                        value={objForm.a}
                                        onChange={e => setObjForm({ ...objForm, a: e.target.value })}
                                    />
                                </div>
                                <button onClick={handleSaveObjection} className="btn btn-primary w-full mt-4" disabled={loading}>
                                    {editingId ? 'Atualizar Objeção' : <><Save size={20} /> Salvar Objeção</>}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* List Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white mb-6">
                            {activeTab === 'products' ? `Produtos Cadastrados (${products.length})` : `Objeções Cadastradas (${objections.length})`}
                        </h2>

                        {activeTab === 'products' ? (
                            products.map(p => (
                                <div key={p.id} className="bg-surface p-4 rounded-xl border border-slate-800 flex gap-4 items-center group hover:border-slate-600 transition-colors">
                                    <div className="h-16 w-16 bg-slate-900 rounded-lg overflow-hidden flex-shrink-0 relative">
                                        {p.img ? <img src={p.img} className="h-full w-full object-cover" /> : <ImageIcon className="h-full w-full p-4 text-slate-700" />}
                                        {p.images && p.images.length > 1 && (
                                            <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] px-1 rounded-tl">+{p.images.length - 1}</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white">{p.name}</h4>
                                        <span className="text-xs text-secondary font-mono bg-secondary/10 px-2 py-0.5 rounded">{p.category}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(p, 'products')} className="p-2 text-slate-600 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDelete('products', p.id)} className="p-2 text-slate-600 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            objections.map(o => (
                                <div key={o.id} className="bg-surface p-4 rounded-xl border border-slate-800 group hover:border-slate-600 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs text-secondary font-mono bg-secondary/10 px-2 py-0.5 rounded">{o.category}</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(o, 'objections')} className="p-2 text-slate-600 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={() => handleDelete('objections', o.id)} className="p-2 text-slate-600 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-white mb-1">"{o.q}"</h4>
                                    <p className="text-slate-400 text-sm line-clamp-2">{o.a}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
