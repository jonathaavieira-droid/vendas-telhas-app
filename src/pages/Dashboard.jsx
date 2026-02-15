import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, Circle, Plus, MoreVertical, Trash2, X, Save, AlertCircle, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    // State
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [taskForm, setTaskForm] = useState({ title: '', time: '', desc: '' });

    // Fetch Tasks
    useEffect(() => {
        fetchTasks(selectedDate);
    }, [selectedDate]);

    const fetchTasks = async (date) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('date', date)
                .order('time', { ascending: true });

            if (error) throw error;
            setTasks(data || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    // Actions
    const toggleTask = async (id, status) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, done: !status } : t));
        await supabase.from('tasks').update({ done: !status }).eq('id', id);
    };

    const deleteTask = async (id) => {
        if (!confirm('Excluir?')) return;
        setTasks(tasks.filter(t => t.id !== id));
        await supabase.from('tasks').delete().eq('id', id);
    };

    const startAdd = () => {
        setIsAdding(true);
        setTaskForm({ title: '', time: '09:00', desc: '' });
    };

    const saveNew = async () => {
        if (!taskForm.title) return;

        if (!user) {
            alert("Erro: Usuário não identificado. Faça login novamente.");
            return;
        }

        const newTask = {
            ...taskForm,
            done: false,
            date: selectedDate,
            id: Date.now(),
            user_id: user.id
        };

        // Optimistic UI update
        setTasks([...tasks, newTask]);
        setIsAdding(false);
        setTaskForm({ title: '', time: '', desc: '' });

        const { data, error } = await supabase.from('tasks').insert([{
            title: newTask.title,
            time: newTask.time,
            date: newTask.date,
            done: newTask.done,
            user_id: user.id
        }]).select();

        if (error) {
            console.error("Error saving task:", error);
            alert("Erro ao salvar tarefa: " + error.message);
            // Revert optimistic update here if needed, but for MVP keep simple
        } else if (data) {
            setTasks(prev => prev.map(t => t.id === newTask.id ? data[0] : t));
        }
    };

    const startEdit = (e, task) => {
        e.stopPropagation();
        setEditingId(task.id);
        setTaskForm({ title: task.title, time: task.time, desc: task.desc });
    };

    const saveEdit = async () => {
        setTasks(tasks.map(t => t.id === editingId ? { ...t, ...taskForm } : t));
        setEditingId(null);
        await supabase.from('tasks').update({ ...taskForm }).eq('id', editingId);
    };

    // Date Helpers
    const changeDate = (days) => {
        const result = new Date(selectedDate + 'T12:00:00'); // Force noon to avoid timezone shift
        result.setDate(result.getDate() + days);
        setSelectedDate(result.toISOString().split('T')[0]);
    };

    // Derived State
    const completedCount = tasks.filter(t => t.done).length;
    const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
    const dateObj = new Date(selectedDate + 'T12:00:00');
    const dayName = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });
    const dayNum = dateObj.getDate();
    const month = dateObj.toLocaleDateString('pt-BR', { month: 'long' });
    const isToday = selectedDate === new Date().toISOString().split('T')[0];

    return (
        <div className="space-y-6 animate-fade-in pb-24 max-w-4xl mx-auto">
            {/* Minimalist Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        Tarefas Diárias
                        {tasks.length > 0 && (
                            <span className="text-secondary text-sm font-normal bg-secondary/10 px-2 py-1 rounded-full border border-secondary/20">
                                {progress}% Concluído
                            </span>
                        )}
                    </h1>
                    <div className="flex items-center gap-2 text-slate-400 mt-1 capitalize cursor-pointer relative group">
                        <Calendar size={16} className="text-secondary" />
                        <span className="text-white font-bold">{dayName}</span>, {dayNum} de {month}

                        {/* Hidden Date Input for Picker */}
                        <input
                            type="date"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <span className="text-xs bg-slate-800 px-1 rounded text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">Mudar Data</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-surface rounded-lg border border-slate-700 p-1">
                        <button onClick={() => changeDate(-1)} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                            <ChevronLeft size={18} />
                        </button>
                        <button onClick={() => changeDate(1)} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    {!isToday && (
                        <button onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])} className="text-sm font-bold text-slate-500 hover:text-secondary transition-colors px-2">
                            Hoje
                        </button>
                    )}

                    <button onClick={startAdd} className="btn btn-primary px-4 py-2 ml-2 flex items-center gap-2">
                        <Plus size={18} /> <span className="hidden md:inline">Nova Tarefa</span>
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="space-y-3">
                <AnimatePresence>
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-surface p-4 rounded-xl border border-secondary shadow-lg shadow-black/50 mb-6"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Adicionar Tarefa</h3>
                                <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-3">
                                    <input
                                        type="time"
                                        className="input w-36 text-center font-mono"
                                        value={taskForm.time}
                                        onChange={e => setTaskForm({ ...taskForm, time: e.target.value })}
                                    />
                                    <input
                                        className="input flex-1"
                                        placeholder="O que você precisa fazer?"
                                        value={taskForm.title}
                                        onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                                <input
                                    className="input text-sm"
                                    placeholder="Detalhes adicionais (opcional)"
                                    value={taskForm.desc}
                                    onChange={e => setTaskForm({ ...taskForm, desc: e.target.value })}
                                />
                                <div className="flex justify-end pt-2">
                                    <button onClick={saveNew} className="btn btn-primary w-full md:w-auto">Confirmar</button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {tasks.map((task) => (
                        <motion.div
                            layout
                            key={task.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={`
                                group flex items-start gap-4 p-4 rounded-xl border transition-all duration-200
                                ${task.done
                                    ? 'bg-slate-900/30 border-slate-800 opacity-60'
                                    : 'bg-surface border-slate-700 hover:border-slate-600 hover:shadow-md'
                                }
                            `}
                        >
                            <button
                                onClick={() => toggleTask(task.id, task.done)}
                                className={`mt-1 flex-shrink-0 transition-colors ${task.done ? 'text-secondary' : 'text-slate-600 hover:text-secondary'}`}
                            >
                                {task.done ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                            </button>

                            {editingId === task.id ? (
                                <div className="flex-1 space-y-3">
                                    <div className="flex gap-3">
                                        <input
                                            type="time"
                                            className="input w-32 py-1 h-8 text-sm text-center"
                                            value={taskForm.time}
                                            onChange={e => setTaskForm({ ...taskForm, time: e.target.value })}
                                        />
                                        <input
                                            className="input flex-1 py-1 h-8 text-sm"
                                            value={taskForm.title}
                                            onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => setEditingId(null)} className="text-xs text-slate-400 hover:text-white">Cancelar</button>
                                        <button onClick={saveEdit} className="text-xs text-secondary font-bold hover:underline">Salvar</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex justify-between items-start gap-4 cursor-pointer" onClick={() => toggleTask(task.id, task.done)}>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className={`font-mono text-xs font-bold ${task.done ? 'text-slate-600' : 'text-secondary'}`}>
                                                {task.time.slice(0, 5)}
                                            </span>
                                            <h3 className={`font-medium text-base ${task.done ? 'line-through text-slate-500' : 'text-white'}`}>
                                                {task.title}
                                            </h3>
                                        </div>
                                        {task.desc && (
                                            <p className={`text-sm mt-1 ml-[calc(3rem+4px)] ${task.done ? 'text-slate-600' : 'text-slate-400'}`}>
                                                {task.desc}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => startEdit(e, task)} className="p-1.5 text-slate-500 hover:text-white rounded hover:bg-white/5 transition-colors">
                                            <Edit3 size={16} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} className="p-1.5 text-slate-500 hover:text-danger rounded hover:bg-danger/10 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {tasks.length === 0 && !loading && !isAdding && (
                        <div className="text-center py-16">
                            <div className="bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                                <Calendar size={32} />
                            </div>
                            <h3 className="text-slate-300 font-bold">Dia Livre!</h3>
                            <p className="text-slate-500 text-sm mt-1">Nenhuma tarefa agendada para hoje.</p>
                            <button onClick={startAdd} className="text-secondary text-sm font-bold mt-4 hover:underline">Adicionar Primeira Tarefa</button>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Dashboard;
