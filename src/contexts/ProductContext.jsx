import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ProductContext = createContext();

const initialProducts = [
    { id: 1, name: 'Telha Termoacústica', category: 'Cobertura', desc: 'Isolamento térmico e acústico superior com núcleo de PIR.', img: 'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800' },
    { id: 2, name: 'Telha Trapezoidal', category: 'Cobertura', desc: 'Alta resistência mecânica para grandes vãos.', img: 'https://images.unsplash.com/photo-1628624747186-a9419477443f?w=800' },
    { id: 3, name: 'Perfil U Enrijecido', category: 'Estrutura', desc: 'Leveza e resistência para estruturas metálicas.', img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800' },
    { id: 4, name: 'Cumeeira', category: 'Acabamento', desc: 'Fechamento perfeito para o encontro de águas.', img: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800' },
];

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data && data.length > 0) setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            // Fallback to initialProducts if DB is empty or fails
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async (product) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .insert([product])
                .select();

            if (error) throw error;
            if (data) setProducts([data[0], ...products]);
        } catch (error) {
            console.error('Error adding product:', error);
            // Optimistic update fallback
            setProducts([{ ...product, id: Date.now() }, ...products]);
        }
    };

    const removeProduct = async (id) => {
        try {
            await supabase.from('products').delete().eq('id', id);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const updateProduct = async (id, updatedProduct) => {
        try {
            await supabase.from('products').update(updatedProduct).eq('id', id);
            setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, removeProduct, updateProduct, loading }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);
