import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import api from '../api/axios'
import { motion } from 'framer-motion'

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const loadProducts = async () => {
    // const res = await api.get(`/products?search=${search}&category=${category}`);
    // better way
    const res = await api.get('/products', {
      params: {
        search, // search: search
        category // category: category
      }
    })
    // console.log("Database se aaya data:", res.data);
    setProducts(res.data);
  }

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please Login to Add Items to Your Cart.");
      return;
    }

    const res = await api.post('/cart/add', { userId, productId });
    console.log("cart response", res.data);

    // const total = res.data.cart.items.reduce(
    //   (sum, item) => sum + item.productId.price * item.quantity,
    //   0
    // );

    // localStorage.setItem("cartCount", total);
    window.dispatchEvent(new Event("cartUpdated"));
  }

  return (
    <div className='min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased py-10 px-4 sm:px-8 relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-300'>
      
      {/* Dynamic Ambient Blur Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-emerald-500/15 via-emerald-500/5 to-transparent blur-[140px] pointer-events-none rounded-full" />

      {/* 👈 FIXED BOTTOM FROSTED BLUR VIGNETTE (Awwwards Style Dissolve) */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-30 backdrop-blur-[6px] bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent [mask-image:linear-gradient(to_top,black_50%,transparent_100%)]"
      />

      <div className='max-w-7xl mx-auto relative z-10 pb-20'>
        
        {/* Animated Headline Hero */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className='mb-8'
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Curated Collection
          </div>
          <h1 className='text-3xl sm:text-5xl font-black tracking-tight text-white'>
            Explore Products
          </h1>
          <p className='text-zinc-400 text-sm mt-2 font-light'>
            Ultra-minimal essentials engineered for precision.
          </p>
        </motion.div>

        {/* search and category functionality */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='mb-8 flex flex-col sm:flex-row gap-3 items-center justify-between bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/80 backdrop-blur-xl shadow-lg'
        >
          <div className='relative w-full sm:w-2/3'>
            <input
              placeholder='Search products by title...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full bg-zinc-950/80 border border-zinc-800 text-zinc-100 placeholder-zinc-500 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200'
            />
          </div>

          {/* category */}
          <div className='w-full sm:w-1/3'>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='w-full bg-zinc-950/80 border border-zinc-800 text-zinc-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500/80 transition-all cursor-pointer font-medium'
            >
              <option value="">All Categories</option>
              <option value="Soap">Soap</option>
              <option value="Electronics">Electronics</option>
              <option value="Shampoo">Shampoo</option>
              <option value="Charger">Charger</option>
              <option value="Tablet">Tablet</option>
              <option value="Energy Drink">Energy Drink</option>
              <option value="Medicine">Medicine</option>
            </select>
          </div>
        </motion.div>

        {/* Loading / Empty Guard */}
        {!products || products.length === 0 ? (
          <div className='text-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20'>
            <p className='text-zinc-400 font-medium'>No products found.</p>
            <p className='text-xs text-zinc-600 mt-1 font-mono'>Check database or reset search filters.</p>
          </div>
        ) : (
          /* product grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                // 👈 Staggered smooth spring entrance for every single product
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.45, 
                  delay: Math.min(index * 0.05, 0.4), // 👈 Fast stagger feel
                  ease: "easeOut"
                }}
                // 👈 Tactile Card Float on Hover
                whileHover={{ y: -8 }}
                className='group relative bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-4 flex flex-col justify-between hover:border-emerald-500/60 hover:bg-zinc-900/80 hover:shadow-[0_12px_35px_rgba(16,185,129,0.15)] transition-colors duration-300'
              >
                <Link
                  to={`/product/${product._id}`}
                  className='flex flex-col items-center w-full'
                >
                  {/* Clean Product Image Container with Zoom effect */}
                  <div className='w-full h-44 rounded-2xl overflow-hidden bg-white/95 p-3 flex items-center justify-center border border-zinc-800/10 transition-all duration-300'>
                    <motion.img
                      src={product.image}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className='w-full h-full object-contain'
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  </div>

                  <div className='w-full mt-3.5'>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-medium">
                      In Stock
                    </span>
                    <h2 className='font-semibold text-zinc-100 text-sm sm:text-base line-clamp-1 group-hover:text-emerald-400 transition-colors mt-0.5'>
                      {product.title}
                    </h2>
                    <p className='text-emerald-400 font-mono font-bold text-base sm:text-lg mt-1'>
                      ₹{product.price}
                    </p>
                  </div>
                </Link>

                {/* Tactile Spring Add to Cart Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  onClick={() => addToCart(product._id)}
                  className='mt-4 w-full bg-zinc-800 hover:bg-emerald-500 text-zinc-200 hover:text-zinc-950 font-bold text-xs sm:text-sm py-3 px-3 rounded-2xl transition-colors duration-200 shadow-sm flex items-center justify-center gap-1.5'
                >
                  <span>Add to Cart</span>
                  <span className="text-sm font-bold">＋</span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Home