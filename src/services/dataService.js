import { supabase } from '../lib/supabase';

export const DataService = {
    // --- Products ---
    getProducts: async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            console.log("RAW PRODUCTS FETCHED:", data); // DEBUG
            // Map DB 'descr' to Frontend 'desc' to avoid breaking UI that expects 'desc'
            return data?.map(p => ({ ...p, desc: p.descr })) || [];
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    saveProduct: async (product) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .insert([{
                    name: product.name,
                    category: product.category,
                    descr: product.desc, // Frontend uses 'desc', DB uses 'descr'
                    img: product.img,
                    images: product.images, // Array of text
                    cavaben: product.cavaben
                }])
                .select();

            if (error) throw error;
            return { ...data[0], desc: data[0].descr }; // Map back to frontend model
        } catch (error) {
            console.error('Error saving product:', error);
            return product; // Optimistic return or handle error
        }
    },

    updateProduct: async (product) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .update({
                    name: product.name,
                    category: product.category,
                    descr: product.desc,
                    img: product.img,
                    images: product.images, // Array of text
                    cavaben: product.cavaben
                })
                .eq('id', product.id)
                .select();

            if (error) throw error;
            return { ...data[0], desc: data[0].descr };
        } catch (error) {
            console.error('Error updating product:', error);
            return product;
        }
    },

    deleteProduct: async (id) => {
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            return false;
        }
    },

    // --- Objections ---
    getObjections: async () => {
        try {
            const { data, error } = await supabase
                .from('objections')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching objections:', error);
            return [];
        }
    },

    saveObjection: async (objection) => {
        try {
            const { data, error } = await supabase
                .from('objections')
                .insert([{
                    category: objection.category,
                    q: objection.q,
                    a: objection.a
                }])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error saving objection:', error);
            return objection;
        }
    },

    updateObjection: async (objection) => {
        try {
            const { data, error } = await supabase
                .from('objections')
                .update({
                    category: objection.category,
                    q: objection.q,
                    a: objection.a
                })
                .eq('id', objection.id)
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error updating objection:', error);
            return objection;
        }
    },

    deleteObjection: async (id) => {
        try {
            const { error } = await supabase.from('objections').delete().eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting objection:', error);
            return false;
        }
    },

    // --- Tasks ---
    getTasks: async (date) => { // Accept date argument
        try {
            const targetDate = date || new Date().toISOString().split('T')[0];
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('date', targetDate);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching tasks:', error);
            return [];
        }
    },

    updateTask: async (task) => {
        try {
            await supabase.from('tasks').update({
                done: task.done,
                title: task.title,
                desc: task.desc,
                time: task.time
            }).eq('id', task.id);
            return task;
        } catch (error) {
            console.error(error);
            return task;
        }
    }
};
