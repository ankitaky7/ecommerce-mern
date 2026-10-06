import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'

function Checkout() {
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    const [address, setAddress] = useState([]);
    const [cart, setCart] = useState(null);
    const [selectAddress, setSelectAddress] = useState(null);

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }
        api.get(`/cart/${userId}`).then((res) => setCart(res.data));
        api.get(`/address/${userId}`).then((res) => {
            setAddress(res.data);
            if (res.data && res.data.length > 0) {
                setSelectAddress(res.data[0]);
            }
        });
    }, [userId, navigate]);

    if (!cart) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-400">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ repeat: Infinity, duration: 1.2, repeatType: "reverse" }}
                    className="flex items-center gap-3"
                >
                    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                    <span className="text-sm font-medium tracking-wide">Initializing checkout...</span>
                </motion.div>
            </div>
        );
    }

    const total = cart.items ? cart.items.reduce(
        (sum, i) => sum + i.quantity * (i.productId?.price || 0), 0
    ) : 0;

    const placeOrder = () => {
        if (cart.items.length === 0) {
            alert("Cart is empty! Add products first.");
            return;
        }
        if (!selectAddress) {
            alert("Please Select Address");
            return;
        }

        api.post("/order/place", {
            userId,
            address: selectAddress
        })
            .then((res) => {
                alert("Order Placed Successfully!");
                setCart({ items: [] });
                navigate("/orders");
            })
            .catch((err) => {
                const msg = err.response?.data?.message || "Order failed";
                alert("Backend Error: " + msg);
            });
    };

    const handleNavigate = () => {
        navigate("/checkout-address")
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased py-12 px-4 sm:px-8 selection:bg-emerald-500/30 selection:text-emerald-300">
            <div className="max-w-6xl mx-auto">

                {/* Header with Smooth Fade Up */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Secure Checkout Protocol
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">Review & Pay</h1>
                </motion.div>

                {/* 2-Column Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Address Selection */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="lg:col-span-7 space-y-6"
                    >
                        <div>
                            {/* Section Header with contextual Top Action Button */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-zinc-400">1. Delivery Address</h2>
                                    <span className="text-[11px] text-zinc-500 font-mono">({address.length} Saved)</span>
                                </div>
                                
                                {/* 👈 Clean Secondary Action Button in Header */}
                                <motion.button
                                    onClick={handleNavigate}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.96 }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 border border-zinc-800 hover:border-emerald-500/30 text-xs font-medium transition-all"
                                >
                                    <span className="text-emerald-400 font-bold text-sm">＋</span>
                                    <span>New Address</span>
                                </motion.button>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <AnimatePresence>
                                    {address.map((addr) => {
                                        const isSelected = selectAddress?._id === addr._id;
                                        return (
                                            <motion.div
                                                key={addr._id}
                                                layout
                                                onClick={() => setSelectAddress(addr)}
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.99 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                className={`relative p-5 rounded-2xl cursor-pointer transition-all border overflow-hidden ${isSelected
                                                        ? 'bg-zinc-900/90 border-emerald-500/70 shadow-[0_0_30px_rgba(16,185,129,0.12)]'
                                                        : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/60'
                                                    }`}
                                            >
                                                {/* Floating Glow Indicator using layoutId */}
                                                {isSelected && (
                                                    <motion.div
                                                        layoutId="activeGlow"
                                                        className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent pointer-events-none"
                                                        transition={{ type: "spring", stiffness: 350, damping: 35 }}
                                                    />
                                                )}

                                                <div className="flex items-start justify-between relative z-10">
                                                    <div>
                                                        <div className="flex items-center gap-2.5">
                                                            <p className="font-semibold text-zinc-100 text-base">{addr.fullName}</p>
                                                            {isSelected && (
                                                                <motion.span
                                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                                    animate={{ scale: 1, opacity: 1 }}
                                                                    className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border border-emerald-500/20"
                                                                >
                                                                    Selected
                                                                </motion.span>
                                                            )}
                                                        </div>
                                                        <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed font-light">
                                                            {addr.addressLine}, {addr.city}, {addr.state} – {addr.pincode}
                                                        </p>
                                                        <p className="text-zinc-500 text-xs mt-3 font-mono">
                                                            📞 {addr.phone}
                                                        </p>
                                                    </div>

                                                    {/* Custom Animated Checkbox Circle */}
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 mt-1 ${isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-zinc-700 bg-zinc-800/50'
                                                        }`}>
                                                        {isSelected && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="w-2 h-2 rounded-full bg-zinc-950"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>

                                {/* 👈 Dashed Secondary Slot: Fits naturally beneath existing addresses */}
                                <motion.button
                                    onClick={handleNavigate}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full p-4 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 bg-zinc-900/20 hover:bg-zinc-900/50 text-zinc-400 hover:text-emerald-300 transition-all flex items-center justify-center gap-2.5 text-sm font-medium group"
                                >
                                    <span className="w-6 h-6 rounded-lg bg-zinc-800/80 group-hover:bg-emerald-500/20 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 transition-colors text-xs font-bold">
                                        ＋
                                    </span>
                                    <span>Add Another Delivery Address</span>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Sticky Order Summary Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-5 sticky top-8"
                    >
                        <div className="bg-zinc-900/70 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
                            {/* Subtle Ambient Background Gradient */}
                            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-zinc-400 mb-6">2. Order Summary</h2>

                            {/* Items List with subtle stagger */}
                            <div className="space-y-4 max-h-60 overflow-y-auto pr-1 scrollbar-none">
                                {cart.items.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * idx }}
                                        className="flex justify-between items-center text-sm group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/40 flex items-center justify-center text-xs text-zinc-300 font-mono transition-colors group-hover:border-emerald-500/40">
                                                ×{item.quantity}
                                            </div>
                                            <div>
                                                <p className="font-medium text-zinc-200 line-clamp-1">{item.productId?.name || "Product"}</p>
                                                <p className="text-xs text-zinc-500 font-mono">₹{item.productId?.price} each</p>
                                            </div>
                                        </div>
                                        <span className="font-mono text-zinc-200">₹{item.quantity * (item.productId?.price || 0)}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <hr className="my-6 border-zinc-800/80" />

                            {/* Cost Breakdown */}
                            <div className="space-y-2.5 text-sm">
                                <div className="flex justify-between text-zinc-400">
                                    <span>Subtotal</span>
                                    <span className="font-mono text-zinc-200">₹{total}</span>
                                </div>
                                <div className="flex justify-between text-zinc-400">
                                    <span>Standard Delivery</span>
                                    <span className="text-emerald-400 font-mono text-xs uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">Free</span>
                                </div>
                                <div className="flex justify-between text-base font-semibold text-white pt-3 border-t border-zinc-800">
                                    <span>Total Payable</span>
                                    <span className="font-mono text-xl text-emerald-400 font-bold">₹{total}</span>
                                </div>
                            </div>

                            {/* Magnetic-Feel Primary Action Button */}
                            <motion.button
                                onClick={placeOrder}
                                whileHover={{ scale: 1.015 }}
                                whileTap={{ scale: 0.98 }}
                                className="group relative mt-7 w-full overflow-hidden rounded-2xl bg-emerald-500 p-4 text-zinc-950 font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_35px_rgba(16,185,129,0.4)] transition-shadow duration-300"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Complete Purchase
                                    <motion.span
                                        className="inline-block"
                                        animate={{ x: [0, 4, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                    >
                                        →
                                    </motion.span>
                                </span>
                            </motion.button>

                            <p className="text-center text-[11px] text-zinc-500 mt-4 tracking-tight">
                                End-to-end 256-bit encrypted checkout
                            </p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}

export default Checkout;