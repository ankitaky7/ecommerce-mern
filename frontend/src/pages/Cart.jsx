import React from 'react'
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';

function Cart() {
    const userId = localStorage.getItem("userId");
    const [cart, setCart] = useState(null);

    // load cart data
    const loadCart = async () => {
        if (!userId) return;
        const res = await api.get(`/cart/${userId}`);
        setCart(res.data);
    }

    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
    }, [userId]);

    // remove cart
    const removeItem = async (productId) => {
        if (!userId) return;
        const items = await api.post("/cart/remove", { userId, productId });
        loadCart();

        window.dispatchEvent(new Event("cartUpdated"));
    }

    // update item quantity
    const updatedCartItem = async (productId, quantity) => {
        if (quantity == 0) {
            await removeItem(productId);
            return;
        }
        const updateItem = await api.post("/cart/update", { userId, productId, quantity });
        loadCart();

        window.dispatchEvent(new Event("cartUpdated"));
    }

    if (!cart) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-400 font-sans">
                <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-sm font-medium tracking-wide">Syncing your cart...</span>
                </div>
            </div>
        );
    }

    const total = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

    return (
        <div className='min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased py-12 px-4 sm:px-8 selection:bg-emerald-500/30 selection:text-emerald-300'>
            <div className='max-w-4xl mx-auto'>
                
                {/* Header Title with Subtitle */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Order Pipeline
                    </div>
                    <div className="flex items-baseline justify-between">
                        <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-white'>Your Cart</h1>
                        <span className='text-xs font-mono text-zinc-500 tracking-wider uppercase'>
                            {cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'} Selected
                        </span>
                    </div>
                </motion.div>

                {
                    cart.items.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className='text-center py-24 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20 backdrop-blur-sm'
                        >
                            <div className="w-12 h-12 mx-auto rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-400 mb-3 text-lg font-mono">
                                0
                            </div>
                            <p className='text-zinc-300 font-semibold text-lg'>Your cart is empty.</p>
                            <p className='text-xs text-zinc-500 mt-1 font-mono'>Explore the catalog to discover engineered essentials.</p>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => navigate('/')}
                                className="mt-6 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold tracking-wide transition-colors"
                            >
                                Back to Shop
                            </motion.button>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {cart.items.map((item) => (
                                    <motion.div
                                        key={item.productId._id}
                                        layout
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                                        whileHover={{ y: -2 }}
                                        className='flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/80 rounded-2xl gap-4 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-300 shadow-sm'
                                    >
                                        {/* Product Thumbnail & Details */}
                                        <div className='flex items-center gap-4 w-full sm:w-auto'>
                                            <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white/95 p-2 flex items-center justify-center shrink-0 border border-zinc-800/20 shadow-inner'>
                                                <img 
                                                    src={item.productId.image} 
                                                    alt={item.productId.title}
                                                    referrerPolicy="no-referrer"
                                                    className='w-full h-full object-contain'
                                                />
                                            </div>
                                            <div>
                                                <h2 className='text-base sm:text-lg font-semibold text-zinc-100 line-clamp-1'>
                                                    {item.productId.title}
                                                </h2>
                                                <p className='text-zinc-400 text-xs sm:text-sm font-mono mt-0.5'>
                                                    ₹{item.productId.price.toFixed(2)} each
                                                </p>
                                            </div>
                                        </div>

                                        {/* Stepper, Subtotal & Actions */}
                                        <div className='flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60'>
                                            
                                            {/* Quantity Pill Stepper */}
                                            <div className='flex items-center gap-2 bg-zinc-950/80 border border-zinc-800 p-1 rounded-xl shadow-inner'>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.92 }}
                                                    onClick={() => updatedCartItem(item.productId._id, item.quantity - 1)}
                                                    className='w-7 h-7 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-sm font-bold transition-colors'
                                                >
                                                    -
                                                </motion.button>
                                                <span className='px-2 text-xs font-mono font-semibold text-zinc-200 min-w-[20px] text-center'>
                                                    {item.quantity}
                                                </span>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.92 }}
                                                    onClick={() => updatedCartItem(item.productId._id, item.quantity + 1)}
                                                    className='w-7 h-7 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-sm font-bold transition-colors'
                                                >
                                                    +
                                                </motion.button>
                                            </div>

                                            {/* Line Item Total */}
                                            <div className='min-w-[80px] text-right'>
                                                <p className='font-mono font-bold text-base text-zinc-100'>
                                                    ₹{(item.productId.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>

                                            {/* Tactile Remove Button */}
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => removeItem(item.productId._id)}
                                                className='text-xs font-mono font-medium text-zinc-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors'
                                            >
                                                Remove
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Summary & Checkout Section */}
                            <motion.div 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="mt-8 p-6 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6"
                            >
                                <div>
                                    <span className="text-xs uppercase tracking-wider font-mono text-zinc-500">Order Subtotal</span>
                                    <h2 className='text-3xl font-extrabold font-mono text-emerald-400 mt-0.5'>
                                        ₹{total.toFixed(2)}
                                    </h2>
                                </div>

                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => navigate('/checkout')} 
                                    className='w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2'
                                >
                                    <span>Proceed to Checkout</span>
                                    <span className="text-base font-bold">→</span>
                                </motion.button>
                            </motion.div>
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default Cart