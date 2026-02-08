import React from 'react';
import { X, Save, AlignLeft, ListFilter, Hash } from 'lucide-react';

// Helper Input Component
const InputWrapper = ({ label, icon: Icon, children }) => (
    <div className="space-y-2 group">
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold group-focus-within:text-white transition-colors flex items-center gap-2">
            {Icon && <Icon className="w-3 h-3" />} {label}
        </label>
        {children}
    </div>
);
const EditPostModal = ({
    editingPost,
    setEditingPost,
    categories,
    handleEditPost
}) => {
    if (!editingPost) return null;


    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-zinc-950 w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white tracking-tight">Edit Postingan</h2>
                    <button
                        onClick={() => setEditingPost(null)}
                        className="p-2 -mr-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    
                    {/* Caption */}
                    <InputWrapper label="Caption" icon={AlignLeft}>
                        <textarea
                            placeholder="Tulis caption baru..."
                            value={editingPost.caption}
                            onChange={(e) => setEditingPost(prev => ({ ...prev, caption: e.target.value }))}
                            className="w-full h-32 bg-zinc-900/50 border border-white/10 rounded-xl p-4 text-zinc-200 placeholder:text-zinc-600 text-sm focus:outline-none focus:border-white/30 resize-none transition-all custom-scrollbar"
                        />
                    </InputWrapper>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Kategori */}
                        <InputWrapper label="Kategori" icon={ListFilter}>
                            <div className="relative">
                                <select
                                    value={editingPost.kategori}
                                    onChange={(e) => setEditingPost(prev => ({ ...prev, kategori: e.target.value }))}
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-zinc-200 focus:outline-none focus:border-white/30 appearance-none cursor-pointer hover:bg-zinc-900 transition-colors"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.name} value={cat.name} className="bg-zinc-900">
                                            {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </InputWrapper>

                        {/* Tags */}
                        <InputWrapper label="Hashtags" icon={Hash}>
                            <input
                                type="text"
                                placeholder="#tags"
                                value={editingPost.tags}
                                onChange={(e) => setEditingPost(prev => ({ ...prev, tags: e.target.value }))}
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-all"
                            />
                        </InputWrapper>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-0 flex gap-3">
                    <button
                        onClick={() => setEditingPost(null)}
                        className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-zinc-400 text-sm font-bold hover:text-white hover:bg-white/5 transition-all"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleEditPost}
                        className="flex-1 py-3 px-4 bg-white text-black rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all shadow-lg shadow-white/5 flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPostModal;