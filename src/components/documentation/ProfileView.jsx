import React, { useState } from 'react';
import {
    Camera,
    Grid3X3,
    Settings,
    Loader2,
    FileText,
    Video,
    Music,
    File,
    Plus,
    Loader,
    Image as ImageIcon,
    Heart,
    MessageCircle
} from 'lucide-react';
import LoadingSpinner from '../Ui/LoadingSpinner';

const ProfileView = ({
    user,
    profileUserId,
    userStats,
    userPosts,
    loading,
    setShowCreatePost,
    openPostDetail,
    onLoadMorePosts
}) => {
    const [loadingPostId, setLoadingPostId] = useState(null);
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [imageErrors, setImageErrors] = useState(new Set());
    
    const isOwnProfile = profileUserId === user.id;

    // Helper to get content type styling
    const getContentTypeDisplay = (post) => {
        const hasValidImage = post.thumbnail && !imageErrors.has(post.id);
        
        if (hasValidImage) return null; 

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

    const handleCreatePost = async () => {
        setIsCreatingPost(true);
        try {
            await setShowCreatePost(true);
        } catch (error) {
            console.error('Error opening create post:', error);
        } finally {
            setIsCreatingPost(false);
        }
    };

    const handleLoadMore = async () => {
        if (loadingMore || !onLoadMorePosts) return;
        setLoadingMore(true);
        try {
            await onLoadMorePosts();
        } catch (error) {
            console.error('Error loading more posts:', error);
        } finally {
            setLoadingMore(false);
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-500">
            
            {/* 1. PROFILE HEADER */}
            <div className="mb-8 bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/5 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-white/10 to-transparent">
                            <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden border border-white/10 shadow-2xl">
                                <span className="text-3xl md:text-4xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                                    {isOwnProfile ? user.name.charAt(0).toUpperCase() : 'U'}
                                </span>
                            </div>
                        </div>
                        {/* Status Indicator (Optional) */}
                        <div className="absolute bottom-2 right-2 w-6 h-6 bg-zinc-950 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                {isOwnProfile ? user.name : 'Profil Pengguna'}
                            </h1>
                            
                            {isOwnProfile && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleCreatePost}
                                        className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all shadow-lg shadow-white/5 flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Post</span>
                                    </button>
                                    <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                                        <Settings className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Bio/Email */}
                        {isOwnProfile && (
                            <p className="text-zinc-400 text-sm">{user.email}</p>
                        )}

                        {/* Stats Row */}
                        <div className="flex items-center justify-center md:justify-start gap-8 pt-2">
                            <div className="text-center md:text-left">
                                <span className="block text-xl font-bold text-white">{userStats.posts_count}</span>
                                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Posts</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="block text-xl font-bold text-white">{userStats.total_likes_received}</span>
                                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Likes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. POSTS GRID */}
            <div className="space-y-6">
                
                {/* Tabs */}
                <div className="flex justify-center border-b border-white/5">
                    <button className="flex items-center gap-2 px-8 py-4 border-b-2 border-white text-white text-xs font-bold uppercase tracking-widest">
                        <Grid3X3 className="w-4 h-4" />
                        <span>Posts</span>
                    </button>
                    {/* Add more tabs like Saved, Tagged if needed */}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <LoadingSpinner />
                    </div>
                ) : userPosts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-3 gap-1 md:gap-4">
                            {userPosts.map(post => {
                                const contentDisplay = getContentTypeDisplay(post);
                                const hasValidImage = post.thumbnail && !imageErrors.has(post.id);
                                
                                return (
                                    <div
                                        key={post.id}
                                        className="group relative aspect-square bg-zinc-900/30 cursor-pointer overflow-hidden rounded-xl border border-white/5 hover:border-white/20 transition-all duration-300"
                                        onClick={() => !loadingPostId && handlePostClick(post.id)}
                                    >
                                        {/* Main Content */}
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
                                            <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${contentDisplay.background} text-white p-2 text-center transition-transform duration-500 group-hover:scale-110 ${
                                                loadingPostId === post.id ? 'opacity-50' : ''
                                            }`}>
                                                <contentDisplay.icon className="w-6 h-6 md:w-8 md:h-8 mb-2 drop-shadow-md" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-90 hidden md:block">
                                                    {contentDisplay.label}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                                                <ImageIcon className="w-8 h-8 text-zinc-600" />
                                            </div>
                                        )}

                                        {/* Hover Overlay */}
                                        <div className={`absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 ${
                                            loadingPostId === post.id ? 'hidden' : ''
                                        }`}>
                                            <div className="flex items-center gap-1 text-white font-bold">
                                                <Heart className="w-5 h-5 fill-white" />
                                                <span>{post.likes_count || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-white font-bold">
                                                <MessageCircle className="w-5 h-5 fill-white" />
                                                <span>{post.comments_count || 0}</span>
                                            </div>
                                        </div>

                                        {/* Loading Overlay */}
                                        {loadingPostId === post.id && (
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                                                <LoadingSpinner />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Load More */}
                        {onLoadMorePosts && (
                            <div className="flex justify-center pt-8">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="px-6 py-3 bg-zinc-900 border border-white/10 rounded-xl text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-white hover:bg-zinc-800 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : <Grid3X3 className="w-4 h-4" />}
                                    {loadingMore ? 'Loading...' : 'Load More'}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-zinc-900/20">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
                            <Camera className="w-6 h-6 text-zinc-600" />
                        </div>
                        <h3 className="text-white font-medium mb-1">Belum Ada Postingan</h3>
                        <p className="text-zinc-500 text-sm mb-6 text-center max-w-sm">
                            {isOwnProfile 
                                ? 'Bagikan momen pertamamu untuk mulai membangun profil.' 
                                : 'Pengguna ini belum membagikan apapun.'}
                        </p>
                        {isOwnProfile && (
                            <button
                                onClick={handleCreatePost}
                                disabled={isCreatingPost}
                                className="px-6 py-3 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isCreatingPost ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                Buat Postingan
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileView;