import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Toaster } from 'react-hot-toast';

export const Layout = () => {
    return (
    <div className='min-h-screen bg-slate-800'>
        <Toaster position="top-right" reverseOrder={false} />
        <Header />
        <Outlet />
    </div>
    );
};