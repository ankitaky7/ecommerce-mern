import React from 'react'
import { useEffect, useState } from 'react'
import api from '../api/axios'
import { Link } from 'react-router'

function ProductList() {
    const [products, setProducts] = useState([])

    const loadProducts = async () => {
        const response = await api.get("/products")
        setProducts(response.data);
    }

    const deletedProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await api.delete(`/products/delete/${id}`)
            alert("Product deleted Successfully!");
            loadProducts();
        } catch (error) {
            console.error("Error deleting product: ", error);
        }
    }

    useEffect(() => {
        loadProducts()
    }, [])

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased py-10 px-4 sm:px-8 selection:bg-emerald-500/30 selection:text-emerald-300">
            <div className="max-w-6xl mx-auto">
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-zinc-800/80">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-medium mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Inventory Control
                        </div>
                        <h1 className='text-3xl font-extrabold tracking-tight text-white'>Product Catalog</h1>
                    </div>

                    <Link 
                        to="/admin/products/add" 
                        className='inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all'
                    >
                        <span>＋ Add New Product</span>
                    </Link>
                </div>

                {/* Table Container */}
                <div className='bg-zinc-900/60 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-2xl'>
                    <div className="overflow-x-auto">
                        <table className='w-full text-left border-collapse'>
                            <thead>
                                <tr className='border-b border-zinc-800/80 bg-zinc-950/60 text-[11px] font-mono uppercase tracking-wider text-zinc-400'>
                                    <th className='py-4 px-6 font-semibold'>Product Details</th>
                                    <th className='py-4 px-6 font-semibold'>Price</th>
                                    <th className='py-4 px-6 font-semibold'>Stock Level</th>
                                    <th className='py-4 px-6 font-semibold text-right'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-zinc-800/60 text-sm'>
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-12 text-center text-zinc-500 font-mono text-xs">
                                            No products found in database.
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product._id} className='hover:bg-zinc-800/30 transition-colors group'>
                                            {/* Title & Identifier */}
                                            <td className='py-4 px-6 font-medium text-white'>
                                                <div className="flex items-center gap-3">
                                                    {product.image && (
                                                        <div className="w-10 h-10 rounded-lg bg-white/95 p-1 border border-zinc-700/50 flex-shrink-0 flex items-center justify-center">
                                                            <img src={product.image} alt="" className="w-full h-full object-contain" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="line-clamp-1 text-zinc-100 font-semibold">{product.title}</p>
                                                        <span className="text-[10px] font-mono text-zinc-500">ID: {String(product._id).slice(-6)}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Price */}
                                            <td className='py-4 px-6 font-mono text-emerald-400 font-semibold'>
                                                ₹{product.price}
                                            </td>

                                            {/* Stock Status Badge */}
                                            <td className='py-4 px-6 font-mono'>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                    Number(product.stock) > 5 
                                                        ? 'bg-zinc-900 border-zinc-800 text-zinc-300' 
                                                        : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${Number(product.stock) > 5 ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
                                                    {product.stock} units
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className='py-4 px-6 text-right space-x-3'>
                                                <Link 
                                                    to={`/admin/products/edit/${product._id}`} 
                                                    className='inline-block px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/50 text-xs font-mono transition-colors'
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => deletedProduct(product._id)}
                                                    className='inline-block px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-mono transition-colors'
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ProductList