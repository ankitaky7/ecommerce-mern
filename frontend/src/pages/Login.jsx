import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", form)
      console.log(response, "data");

      // save token to local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.User.id);

      setMsg("Login Successfull");
      // Redirect it to Home Page after 1 sec
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      setMsg(error.response?.data?.message || "An Error Occurred")
    }
  }


  return (
    <div className='flex items-center justify-center min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased px-4 relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-300'>
      
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/5 to-transparent blur-[140px] pointer-events-none rounded-full" />

      {/* Floating Glassmorphic Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 bg-zinc-900/50 backdrop-blur-2xl border border-zinc-800/80 p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] w-full max-w-md"
      >
        {/* Subtle Top Identity Tag */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Authentication Gate
          </div>
          <h2 className='text-3xl font-extrabold tracking-tight text-white'>Welcome Back</h2>
          <p className='text-xs sm:text-sm text-zinc-400 mt-1 font-light'>Enter your credentials to access your session</p>
        </div>

        {/* Dynamic Alert Message */}
        <AnimatePresence>
          {msg && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`text-xs font-mono font-medium p-3 rounded-xl mb-5 text-center border ${
                msg.toLowerCase().includes("success")
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {msg}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
              Email Address
            </label>
            <input 
              name='email'
              placeholder='name@domain.com'
              value={form.email}
              onChange={handleChange}
              className='w-full px-4 py-3 bg-zinc-950/80 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm rounded-xl focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200'
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
              Password
            </label>
            <input 
              name='password'
              placeholder='••••••••'
              value={form.password}
              onChange={handleChange}
              className='w-full px-4 py-3 bg-zinc-950/80 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm rounded-xl focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200'
              required
              type='password'
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            type='Submit'
            className='w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-200 flex items-center justify-center gap-2'
          >
            <span>Sign In to Account</span>
            <span className="font-mono text-base">→</span>
          </motion.button>
        </form>

      </motion.div>
    </div>
  )
}

export default Login