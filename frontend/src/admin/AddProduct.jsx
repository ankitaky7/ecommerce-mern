import React from 'react'
import { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router'

function AddProduct() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: ""
    });

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
            await api.post("/products/add", form);
            alert("Product Added Successfully!");
            navigate("/admin/products");
        } catch (error) {
            // console.log("Status Code:", error.response?.status);
            // console.log("Backend Exact Error:", error.response?.data);

            console.error("Error Adding Product: ", error);
        }
    }

    const labelMap = {
        title: "Product Title",
        description: "Description",
        price: "Price (₹ / $)",
        category: "Category",
        image: "Image URL",
        stock: "Inventory Stock"
    };

    return (
        <div className='min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased py-12 px-4 sm:px-6 flex items-center justify-center selection:bg-emerald-500/30 selection:text-emerald-300'>
            <div className='w-full max-w-xl bg-zinc-900/60 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl'>
                
                {/* Header */}
                <div className="mb-6 flex items-center justify-between border-b border-zinc-800/80 pb-5">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-medium mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Catalog Control
                        </div>
                        <h2 className='text-2xl font-bold tracking-tight text-white'>Add New Product</h2>
                    </div>
                    <button 
                        type="button"
                        onClick={() => navigate("/admin/products")}
                        className="text-xs font-mono text-zinc-500 hover:text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 transition-colors"
                    >
                        Back to List
                    </button>
                </div>

                {/* Snappy Form */}
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {
                            Object.keys(form).map((key) => {
                                const isFullWidth = key === "title" || key === "description" || key === "image";
                                const isDescription = key === "description";

                                return (
                                    <div key={key} className={isFullWidth ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}>
                                        <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
                                            {labelMap[key] || key}
                                        </label>
                                        
                                        {isDescription ? (
                                            <textarea
                                                name={key}
                                                rows="3"
                                                value={form[key]}
                                                onChange={handleChange}
                                                placeholder={`Enter ${labelMap[key] || key}`}
                                                required
                                                className='w-full px-3.5 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all font-sans resize-none'
                                            />
                                        ) : (
                                            <input 
                                                type={key === "price" || key === "stock" ? "number" : "text"}
                                                name={key}
                                                value={form[key]}
                                                onChange={handleChange}
                                                placeholder={`Enter ${labelMap[key] || key}`}
                                                required
                                                className='w-full px-3.5 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all font-sans'
                                            />
                                        )}
                                    </div>
                                );
                            })
                        }
                    </div>

                    {/* Action Button */}
                    <div className="pt-3">
                        <button 
                            type='submit' 
                            className='w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all'
                        >
                            Publish Product to Store
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddProduct