import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ObjectionContext = createContext();

const initialObjections = [
    { id: 1, category: 'Custo', q: 'A telha sanduíche é muito cara?', a: 'SENTIR: Entendo que o investimento inicial pareça alto. SENTIU: Muitos clientes sentiam o mesmo antes de instalar. DESCOBRIU: Eles descobriram que a economia de energia (até 30% no ar condicionado) e a dispensa de forro pagam a diferença em 18 meses.' },
    { id: 2, category: 'Durabilidade', q: 'Vai enferrujar rápido?', a: 'SENTIR: É natural se preocupar com corrosão. SENTIU: Clientes no litoral tinham esse receio. DESCOBRIU: Com nosso tratamento Galvalume AZ150, a vida útil é 4x maior que a telha comum, com garantia de fábrica.' },
    { id: 3, category: 'Conforto', q: 'O barulho de chuva incomoda?', a: 'SENTIR: Ninguém gosta de barulho de chuva no telhado. SENTIU: Em galpões antigos isso era um problema. DESCOBRIU: O núcleo de EPS/PIR reduz em até 30 decibéis o ruído. É como se tivesse uma laje de concreto.' },
];

export const ObjectionProvider = ({ children }) => {
    const [objections, setObjections] = useState(initialObjections);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchObjections();
    }, []);

    const fetchObjections = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('objections')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data && data.length > 0) setObjections(data);
        } catch (error) {
            console.error('Error fetching objections:', error);
        } finally {
            setLoading(false);
        }
    };

    const addObjection = async (objection) => {
        try {
            const { data, error } = await supabase
                .from('objections')
                .insert([objection])
                .select();

            if (error) throw error;
            if (data) setObjections([data[0], ...objections]);
        } catch (error) {
            console.error('Error adding objection:', error);
            // Optimistic fallback
            setObjections([{ ...objection, id: Date.now() }, ...objections]);
        }
    };

    const removeObjection = async (id) => {
        try {
            await supabase.from('objections').delete().eq('id', id);
            setObjections(objections.filter(o => o.id !== id));
        } catch (error) {
            console.error('Error deleting objection:', error);
        }
    };

    const updateObjection = async (id, updatedObjection) => {
        try {
            await supabase.from('objections').update(updatedObjection).eq('id', id);
            setObjections(objections.map(o => o.id === id ? { ...o, ...updatedObjection } : o));
        } catch (error) {
            console.error('Error updating objection:', error);
        }
    };

    return (
        <ObjectionContext.Provider value={{ objections, addObjection, removeObjection, updateObjection, loading }}>
            {children}
        </ObjectionContext.Provider>
    );
};

export const useObjections = () => useContext(ObjectionContext);
