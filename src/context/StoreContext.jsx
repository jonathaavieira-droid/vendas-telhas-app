import React, { createContext, useContext, useEffect, useState } from 'react';
import { DataService } from '../services/dataService';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [objections, setObjections] = useState([]);
    const [dailyTasks, setDailyTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // Fetch independently to prevent one failure from blocking others
                const p = await DataService.getProducts().catch(err => { console.error("Products error:", err); return []; });
                const o = await DataService.getObjections().catch(err => { console.error("Objections error:", err); return []; });
                const t = await DataService.getTasks().catch(err => { console.error("Tasks error:", err); return []; });

                setProducts(p || []);
                setObjections(o || []);
                setDailyTasks(t || []);
            } catch (err) {
                console.error("Critical Data Load Error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // --- Actions (MVC Controllers) ---

    const addProduct = async (product) => {
        const saved = await DataService.saveProduct(product);
        setProducts(prev => [saved, ...prev]);
    };

    const updateProduct = async (product) => {
        const saved = await DataService.updateProduct(product);
        setProducts(prev => prev.map(p => p.id === saved.id ? saved : p));
    };

    const removeProduct = async (id) => {
        await DataService.deleteProduct(id);
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const addObjection = async (obj) => {
        const saved = await DataService.saveObjection(obj);
        setObjections(prev => [saved, ...prev]);
    };

    const updateObjection = async (obj) => {
        const saved = await DataService.updateObjection(obj);
        setObjections(prev => prev.map(o => o.id === saved.id ? saved : o));
    };

    const removeObjection = async (id) => {
        await DataService.deleteObjection(id);
        setObjections(prev => prev.filter(o => o.id !== id));
    };

    const toggleTask = async (id) => {
        const task = dailyTasks.find(t => t.id === id);
        if (task) {
            const updated = { ...task, done: !task.done };
            await DataService.updateTask(updated);
            setDailyTasks(prev => prev.map(t => t.id === id ? updated : t));
        }
    };

    const updateTaskContent = async (updatedTask) => {
        await DataService.updateTask(updatedTask);
        setDailyTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    return (
        <StoreContext.Provider value={{
            products, addProduct, updateProduct, removeProduct,
            objections, addObjection, updateObjection, removeObjection,
            dailyTasks, toggleTask, updateTaskContent,
            isLoading
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);
