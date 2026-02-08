import React from 'react';
import { Search, Camera } from 'lucide-react';
import PostCard from './PostCard';
import LoadingSpinner from '../Ui/LoadingSpinner';

const SearchView = ({
    feedFilters,
    searchResults,
    searchLoading,
    setFeedFilters,
    user,
    handleLike,
    openPostDetail,
    handleComment,
    newComment,
    setNewComment,
    setShowPostMenu,
    showPostMenu,
    setEditingPost,
    setShowDeleteConfirm,
    setCurrentPage,
    loadUserProfile
}) => (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {/* Search Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div className="space-y-1">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-emerald-500" />
                    Hasil Pencarian
                </h2>
                <p className="text-zinc-400 text-sm">
                    Menampilkan hasil untuk: <span className="font-bold text-white">"{feedFilters.search}"</span>
                </p>
            </div>
            {!searchLoading && searchResults.length > 0 && (
                <span className="px-3 py-1 bg-zinc-900 border border-white/10 rounded-full text-xs font-medium text-zinc-400">
                    {searchResults.length} hasil ditemukan
                </span>
            )}
        </div>

        {/* Content */}
        {searchLoading && searchResults.length === 0 ? (
            <div className="flex justify-center py-20">
                <LoadingSpinner text='Mencari...' />
            </div>
        ) : searchResults.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-zinc-900/20">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
                    <Search className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-white font-medium mb-1">Tidak ada hasil</h3>
                <p className="text-zinc-500 text-sm">Coba kata kunci yang berbeda atau periksa ejaan Anda.</p>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-1 gap-6">
                    {searchResults.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            user={user}
                            handleLike={handleLike}
                            openPostDetail={openPostDetail}
                            handleComment={handleComment}
                            newComment={newComment}
                            setNewComment={setNewComment}
                            setShowPostMenu={setShowPostMenu}
                            showPostMenu={showPostMenu}
                            setEditingPost={setEditingPost}
                            setShowDeleteConfirm={setShowDeleteConfirm}
                            setCurrentPage={setCurrentPage}
                            loadUserProfile={loadUserProfile}
                        />
                    ))}
                </div>
                
                {!searchLoading && (
                    <div className="text-center mt-10">
                        <button
                            onClick={() => setFeedFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                            className="px-8 py-3 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-sm font-medium"
                        >
                            Muat Lebih Banyak
                        </button>
                    </div>
                )}
            </>
        )}
    </div>
);

export default SearchView;