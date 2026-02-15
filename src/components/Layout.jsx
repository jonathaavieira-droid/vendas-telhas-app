import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="flex flex-col md:flex-row h-screen bg-background overflow-hidden font-sans text-primary">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
