import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import api from '../api/axios'
import { motion } from 'framer-motion'
import Home from './Home'

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null)

  const loadProducts = async () => {
    const res = await api.get("/products/");
    const products = res.data.find((p) => String(p._id) == String(id));
    setProduct(products)
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className='relative min-h-screen bg-[#09090b] overflow-hidden text-zinc-100 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300'>
      
      {/* 👈 1. LIVE HOME PAGE: Heavy inline CSS blur and slight dim so it is CLEARLY visible */}
      <div 
        style={{
          filter: 'blur(22px)',
          WebkitFilter: 'blur(22px)',
          transform: 'scale(1.05) translateZ(0)',
          opacity: 0.65,
        }}
        className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
      >
        <Home />
      </div>

      {/* 👈 2. FROSTED GLASS TINT OVERLAY (Semi-transparent so blur pops) */}
      <div 
        onClick={() => navigate('/')}
        style={{
          backgroundColor: 'rgba(9, 9, 11, 0.55)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)'
        }}
        className="fixed inset-0 z-20 cursor-pointer flex items-center justify-center p-4 sm:p-6"
      >
        
        {/* Soft Radial Ambient Spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/15 blur-[160px] pointer-events-none rounded-full" />

        {/* Loading Spinner without White Flash */}
        {!product ? (
          <div className="flex items-center gap-3 text-zinc-400 font-mono text-sm z-30">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Focusing product...</span>
          </div>
        ) : (
          /* 👈 3. COMPACT SPOTLIGHT CARD */
          <motion.div 
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.88, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              mass: 0.7 
            }}
            className='relative z-30 w-full max-w-sm sm:max-w-md bg-zinc-950/90 border border-zinc-800/90 rounded-3xl p-6 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.95)] ring-1 ring-white/10 cursor-default'
          >
            {/* Header Row */}
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Product Spotlight
              </span>
              <button 
                onClick={() => navigate('/')}
                className="w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors border border-zinc-800 text-xs font-mono"
              >
                ✕
              </button>
            </div>

            {/* Product Image Canvas */}
            <div className='w-full h-56 rounded-2xl bg-white/95 p-5 flex items-center justify-center border border-zinc-800/10 shadow-inner overflow-hidden relative group'>
              <motion.img 
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                src={product.image} 
                alt={product.title} 
                referrerPolicy="no-referrer"
                className='w-full h-full object-contain drop-shadow-sm'
              />
            </div>

            {/* Product Details Section */}
            <div className="mt-5">
              <h1 className='text-lg sm:text-xl font-bold tracking-tight text-white line-clamp-1'>
                {product.title}
              </h1>

              <p className='text-zinc-400 text-xs sm:text-sm mt-1.5 leading-relaxed font-light line-clamp-2'>
                {product.description}
              </p>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-medium">
                    Price
                  </span>
                  <p className='text-xl sm:text-2xl font-bold font-mono text-emerald-400'>
                    ${product.price}
                  </p>
                </div>

                {/* Tactile Button */}
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  className='px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center gap-1.5'
                >
                  <span>Add to Cart</span>
                  <span className="font-mono text-sm font-bold">＋</span>
                </motion.button>
              </div>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProductDetails