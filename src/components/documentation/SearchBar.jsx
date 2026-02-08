import React from 'react';
import { Search, Filter, ChevronDown, Command } from 'lucide-react';

const SearchBar = ({
    feedFilters,
    categories,
    handleSearch,
    setFeedFilters
}) => (
    <div className="mb-10 px-4 max-w-4xl mx-auto w-full">
        {/* 1. Section Label (Micro-Typography) */}
        <div className="flex items-center gap-3 mb-4 px-1 animate-in slide-in-from-bottom-2 fade-in duration-700">
            <div className="p-1.5 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
                <Command className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Explore & Filter
            </span>
        </div>

        {/* 2. Control Bar Container */}
        <div className="flex flex-col md:flex-row gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 group animate-in slide-in-from-bottom-3 fade-in duration-700 delay-100">
                <div className="absolute left-0 top-0 bottom-0 pl-5 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors duration-300" />
                </div>
                
                <input
                    type="text"
                    placeholder="Cari dokumentasi, arsip, atau file..."
                    value={feedFilters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-zinc-900/50 backdrop-blur-md border border-white/5 hover:border-white/10 focus:border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:bg-zinc-900/80 focus:ring-1 focus:ring-white/5 transition-all duration-300 shadow-xl shadow-black/20"
                />
                
                {/* Optional: Keyboard Shortcut Hint */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 pointer-events-none">
                    <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-white/10 bg-white/5 px-2 font-mono text-[10px] font-medium text-zinc-500 opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            </div>

            {/* Category Filter Dropdown */}
            <div className="relative md:w-72 group animate-in slide-in-from-bottom-3 fade-in duration-700 delay-200">
                <div className="absolute left-0 top-0 bottom-0 pl-4 flex items-center pointer-events-none">
                    <Filter className="w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors duration-300" />
                </div>
                
                <select
                    value={feedFilters.kategori}
                    onChange={(e) => setFeedFilters(prev => ({ ...prev, kategori: e.target.value, page: 1 }))}
                    className="w-full h-full appearance-none bg-zinc-900/50 backdrop-blur-md border border-white/5 hover:border-white/10 focus:border-white/20 rounded-2xl py-4 pl-11 pr-10 text-zinc-300 focus:text-white focus:outline-none focus:bg-zinc-900/80 cursor-pointer transition-all duration-300 shadow-xl shadow-black/20"
                >
                    <option value="" className="bg-zinc-900 text-zinc-400">Semua Kategori</option>
                    {categories.map(cat => (
                        <option key={cat.name} value={cat.name} className="bg-zinc-900 text-white py-2">
                            {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)} ({cat.count})
                        </option>
                    ))}
                </select>

                {/* Custom Chevron Arrow */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                </div>
            </div>
        </div>
    </div>
);

export default SearchBar;