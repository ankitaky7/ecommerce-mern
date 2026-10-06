import React from 'react'
import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router';
import api from '../api/axios';
import { FiShoppingCart } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
    // JSX ke andar:
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const loadCart = async () => {
            if (!userId) {
                setCartCount(0);
                return;
            }

            try {
                const res = await api.get(`/cart/${userId}`);
                const total = res.data.items.reduce(
                    (sum, item) => sum + (item.quantity || 0), 0
                );
                setCartCount(total);
            } catch (error) {
                console.error("Error while fetching the Cart");
            }
        };

        loadCart();
        window.addEventListener("cartUpdated", loadCart);

        return () => {
            window.removeEventListener("cartUpdated", loadCart);
        }
    }, [userId]);

    const logout = () => {
        localStorage.clear();
        setCartCount(0);
        navigate("/login");
    }
    return (
        <motion.nav 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className='sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800/80 text-zinc-100 shadow-[0_4px_25px_rgba(0,0,0,0.4)]'
        >
            {/* Brand Logo with Ambient Hover Glow */}
            <Link to="/" className='flex items-center gap-2 group'>
                <div className='w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 font-black text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-transform duration-300 group-hover:scale-105'>
                    A
                </div>
                <span className='font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors'>
                    My Store
                </span>
            </Link>

            <div className="flex items-center space-x-5">
                {/* Cart Icon with Pop Badge */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                        to="/cart" 
                        className='relative flex items-center gap-2 p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 transition-all duration-200 text-zinc-300 hover:text-white'
                    >
                        <FiShoppingCart size={20} className='text-emerald-400' />
                        <span className='text-sm font-mono font-medium tracking-tight'>
                            ({cartCount})
                        </span>
                        
                        <AnimatePresence>
                            {cartCount > 0 && (
                                <motion.span 
                                    key={cartCount}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: [0.8, 1.25, 1], opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 450, damping: 20 }}
                                    className='absolute -top-1.5 -right-2 bg-emerald-500 text-zinc-950 font-black text-[10px] min-w-[20px] h-[20px] flex items-center justify-center px-1 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)] font-mono border-2 border-[#09090b]'
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                </motion.div>

                {/* Authentication Links / Actions */}
                {
                    (!userId) ? (
                        <div className="flex items-center gap-3">
                            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                                <Link 
                                    to='/login' 
                                    className='text-sm font-medium text-zinc-400 hover:text-white px-3 py-2 rounded-xl transition-colors'
                                >
                                    Login
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                                <Link 
                                    to='/signup' 
                                    className='text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 rounded-xl transition-all shadow-[0_0_18px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]'
                                >
                                    Signup
                                </Link>
                            </motion.div>
                        </div>
                    ) : (
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={logout} 
                            className='text-xs font-mono font-semibold uppercase tracking-wider bg-zinc-900 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-500/30 px-3.5 py-2 rounded-xl transition-all duration-200'
                        >
                            Logout
                        </motion.button>
                    )
                }
            </div>
        </motion.nav>
    )
}

export default Navbar