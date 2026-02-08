// src/components/TrendingView.js
import React, { useState } from 'react';
import { TrendingUp, Camera, Heart, MessageCircle, Flame, Loader2, FileText, Video, Music, File, Loader } from 'lucide-react';
import LoadingSpinner from '../Ui/LoadingSpinner';

const TrendingView = ({
    trendingPosts,
    loading,
    openPostDetail,
    setCurrentPage,
    loadUserProfile 
}) => {

    const [loadingPostId, setLoadingPostId] = useState(null);
    const [loadingProfileId, setLoadingProfileId] = useState(null);
    const [imageErrors, setImageErrors] = useState(new Set());

    // Helper to get content type styling
    const getContentTypeDisplay = (post) => {
        const hasValidImage = post.thumbnail && !imageErrors.has(post.id);
        
        if (hasValidImage) return null; // Will render image

        const contentType = post.content_type || post.type;
        const fileName = post.filename || post.title || '';
        const fileExtension = fileName.split('.').pop()?.toLowerCase();

        if (contentType?.includes('video') || ['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(fileExtension)) {
            return { icon: Video, background: 'from-rose-500 to-red-600', label: 'Video' };
        }
        if (contentType?.includes('audio') || ['mp3', 'wav', 'flac', 'm4a', 'aac'].includes(fileExtension)) {
            return { icon: Music, background: 'from-violet-500 to-purple-600', label: 'Audio' };
        }
        if (contentType?.includes('text') || ['txt', 'doc', 'docx', 'pdf', 'rtf'].includes(fileExtension)) {
            return { icon: FileText, background: 'from-blue-500 to-indigo-600', label: 'Document' };
        }
        return { icon: File, background: 'from-zinc-500 to-zinc-700', label: 'File' };
    };

    const handleImageError = (postId) => {
        setImageErrors(prev => new Set([...prev, postId]));
    };

    const handlePostClick = async (postId) => {
        setLoadingPostId(postId);
        try {
            await openPostDetail(postId);
        } catch (error) {
            console.error('Error opening post detail:', error);
        } finally {
            setLoadingPostId(null);
        }
    };

    const handleProfileClick = async (userId) => {
        setLoadingProfileId(userId);
        try {
            setCurrentPage('profile');
            await loadUserProfile(userId);
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoadingProfileId(null);
        }
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-500">
            
            {/* Header */}
            {/* Note: In the main App layout, the header is often handled by the parent, 
                but we keep a subtle indicator here if needed or remove if redundant */}
            
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    {trendingPosts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {trendingPosts.map((post, index) => {
                                const contentDisplay = getContentTypeDisplay(post);
                                const hasValidImage = post.thumbnail && !imageErrors.has(post.id);
                                
                                return (
                                    <div 
                                        key={post.id} 
                                        className="group relative bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50"
                                    >
                                        
                                        {/* Main Content Area */}
                                        <div 
                                            className="relative aspect-[4/5] cursor-pointer"
                                            onClick={() => !loadingPostId && handlePostClick(post.id)}
                                        >
                                            {hasValidImage ? (
                                                <img
                                                    src={post.thumbnail}
                                                    alt="Post"
                                                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                                                        loadingPostId === post.id ? 'opacity-50 scale-100' : ''
                                                    }`}
                                                    onError={() => handleImageError(post.id)}
                                                />
                                            ) : contentDisplay ? (
                                                <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${contentDisplay.background} text-white p-6 text-center`}>
                                                    <div className="p-4 bg-white/20 rounded-2xl mb-3 backdrop-blur-md shadow-lg">
                                                        <contentDisplay.icon className="w-8 h-8" />
                                                    </div>
                                                    <span className="text-sm font-bold uppercase tracking-widest">{contentDisplay.label}</span>
                                                    {post.filename && (
                                                        <span className="text-[10px] opacity-70 mt-1 font-mono bg-black/20 px-2 py-0.5 rounded">
                                                            {post.filename.split('.').pop()?.toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                                    <Camera className="w-12 h-12 text-zinc-600" />
                                                </div>
                                            )}

                                            {/* Rank Badge */}
                                            <div className="absolute top-3 left-3 z-10">
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-white shadow-lg">
                                                    {index < 3 ? (
                                                        <Flame className={`w-3.5 h-3.5 ${
                                                            index === 0 ? 'text-amber-400 fill-amber-400' : 
                                                            index === 1 ? 'text-zinc-300 fill-zinc-300' : 
                                                            'text-amber-700 fill-amber-700'
                                                        }`} />
                                                    ) : (
                                                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                                    )}
                                                    <span className="text-xs font-bold font-mono">#{index + 1}</span>
                                                </div>
                                            </div>

                                            {/* Loading Overlay */}
                                            {loadingPostId === post.id && (
                                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                                                    <LoadingSpinner />
                                                </div>
                                            )}

                                            {/* Hover Overlay Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            {/* Bottom Info (Visible on hover/mobile) */}
                                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-100 z-10">
                                                
                                                {/* Stats */}
                                                <div className="flex items-center gap-4 text-white mb-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                                                        <span className="text-xs font-bold">{post.recent_likes}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <MessageCircle className="w-4 h-4 text-white fill-white/20" />
                                                        <span className="text-xs font-bold">{post.comments_count}</span>
                                                    </div>
                                                </div>

                                                {/* Caption & User */}
                                                <div className="space-y-2">
                                                    <p className="text-sm text-zinc-200 line-clamp-2 leading-relaxed font-medium">
                                                        {post.caption || "No caption"}
                                                    </p>
                                                    
                                                    <div className="flex items-center gap-2 pt-2 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                                                        <div 
                                                            className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1px] cursor-pointer"
                                                            onClick={() => !loadingProfileId && handleProfileClick(post.user.id)}
                                                        >
                                                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                                                {loadingProfileId === post.user.id ? (
                                                                    <Loader2 className="w-3 h-3 animate-spin text-white" />
                                                                ) : (
                                                                    <span className="text-[10px] font-bold text-white">
                                                                        {post.user.name.charAt(0).toUpperCase()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => !loadingProfileId && handleProfileClick(post.user.id)}
                                                            className="text-xs font-bold text-zinc-400 hover:text-white transition-colors truncate"
                                                        >
                                                            {post.user.name}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-zinc-900/20">
                            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-white/5">
                                <TrendingUp className="w-8 h-8 text-zinc-600" />
                            </div>
                            <h3 className="text-white font-medium mb-2">Belum ada post trending</h3>
                            <p className="text-zinc-500 text-sm max-w-sm text-center">
                                Post akan muncul di sini berdasarkan jumlah likes dalam 7 hari terakhir.
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
};

export default TrendingView;