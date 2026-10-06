import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import api from '../api/axios'
import { motion } from 'framer-motion'

function CheckOutAddress() {
  const userId = localStorage.getItem("userId");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: ""
  })

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/address/add", {
        ...form,
        userId,
      });
      navigate("/checkout");
    } catch (error) {
        console.error("Error in Saving Address ", error);
    }
  }

  // Label dictionary to make raw object keys user-friendly
  const labelMap = {
    fullName: "Full Name",
    phone: "Phone Number",
    addressLine: "Street Address / Flat No.",
    city: "City",
    state: "State",
    pincode: "Postal PIN Code"
  };

  return (
    <div className='min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased py-12 px-4 sm:px-6 relative overflow-hidden flex items-center justify-center selection:bg-emerald-500/30 selection:text-emerald-300'>
      
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/5 to-transparent blur-[160px] pointer-events-none rounded-full" />

      {/* Main Glass Card with Spring Physics */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 26,
          mass: 0.8 
        }}
        className='relative z-10 w-full max-w-xl bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-6 sm:p-9 shadow-[0_25px_70px_rgba(0,0,0,0.8)]'
      >
        {/* Header Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Shipping Logistics
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Add Delivery Address</h1>
            <button 
              type="button"
              onClick={() => navigate("/checkout")}
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Cancel ✕
            </button>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1 font-light">
            Provide the exact physical location for doorstep package delivery.
          </p>
        </div>

        {/* Animated Input Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {
              Object.keys(form).map((key) => {
                // AddressLine spans full row, other fields can stay two-column on tablet/desktop
                const isFullWidth = key === "addressLine" || key === "fullName";
                return (
                  <div key={key} className={isFullWidth ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}>
                    <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
                      {labelMap[key] || key}
                    </label>
                    <input 
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      placeholder={`Enter ${labelMap[key] || key}`}
                      required
                      className='w-full px-4 py-3 bg-zinc-950/70 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all font-sans'
                    />
                  </div>
                );
              })
            }
          </div>

          {/* Magnetic Primary Submit Button */}
          <div className="pt-4">
            <motion.button 
              type='submit'
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full overflow-hidden rounded-xl bg-emerald-500 py-3.5 px-4 text-zinc-950 font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.45)] transition-all flex items-center justify-center gap-2"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>Save & Continue to Checkout</span>
                <span className="font-mono text-base">→</span>
              </span>
            </motion.button>
          </div>
        </form>

        <p className="text-center text-[11px] text-zinc-500 mt-5 font-mono">
          Encrypted Address Storage • Fast Checkout Ready
        </p>
      </motion.div>
    </div>
  )
}

export default CheckOutAddress