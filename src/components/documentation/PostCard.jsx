import React, { useState } from 'react';
import { Camera, Heart, MessageCircle, MoreHorizontal, Edit3, Trash2, Bookmark, FileText, Loader } from 'lucide-react';
import { canEditPost, canDeletePost } from '../../utils/postUtils';
import { formatDate } from '../../utils/dateUtils';
import LoadingSpinner from '../Ui/LoadingSpinner';

const PostCard = ({
    post,
    showActions = true,
    user,
    handleLike,
    openPostDetail,
    handleComment,
    setShowPostMenu,
    showPostMenu,
    setEditingPost,
    setShowDeleteConfirm,
    setCurrentPage,
    loadUserProfile
}) => {
    const [localComment, setLocalComment] = useState('');
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isLoadingPost, setIsLoadingPost] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    
    const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
    const [expandedComments, setExpandedComments] = useState(new Set());
    
    const [imageErrors, setImageErrors] = useState(new Set());
    const [imageLoading, setImageLoading] = useState(new Set());

    const CAPTION_LIMIT = 150; 
    const COMMENT_LIMIT = 100; 

    // --- HANDLERS (Logika tetap sama) ---
    const handleCommentSubmit = async (postId) => {
        if (localComment.trim()) {
            setIsSubmittingComment(true);
            try {
                await handleComment(postId, localComment);
                setLocalComment('');
            } catch (error) {
                console.error('Error submitting comment:', error);
            } finally {
                setIsSubmittingComment(false);
            }
        }
    };

    const handleProfileClick = async (userId) => {
        setIsLoadingProfile(true);
        try {
            setCurrentPage('profile');
            await loadUserProfile(userId);
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setIsLoadingProfile(false);
        }
    };

    const handlePostClick = async (postId) => {
        setIsLoadingPost(true);
        try {
            await openPostDetail(postId);
        } catch (error) {
            console.error('Error opening post detail:', error);
        } finally {
            setIsLoadingPost(false);
        }
    };

    const handleImageError = (fileId) => {
        setImageErrors(prev => new Set(prev).add(fileId));
        setImageLoading(prev => {
            const newSet = new Set(prev);
            newSet.delete(fileId);
            return newSet;
        });
    };

    const handleImageLoadStart = (fileId) => {
        setImageLoading(prev => new Set(prev).add(fileId));
    };

    const handleImageLoad = (fileId) => {
        setImageLoading(prev => {
            const newSet = new Set(prev);
            newSet.delete(fileId);
            return newSet;
        });
    };

    const toggleCommentExpansion = (commentId) => {
        const newExpandedComments = new Set(expandedComments);
        if (newExpandedComments.has(commentId)) {
            newExpandedComments.delete(commentId);
        } else {
            newExpandedComments.add(commentId);
        }
        setExpandedComments(newExpandedComments);
    };

    // --- RENDER HELPERS ---
    const renderExpandableText = (text, limit, isExpanded, onToggle, className = "") => {
        if (!text || text.length <= limit) {
            return <span className={className}>{text}</span>;
        }
        const shouldTruncate = !isExpanded;
        const displayText = shouldTruncate ? `${text.slice(0, limit)}...` : text;

        return (
            <>
                <span className={className}>{displayText}</span>
                <button
                    onClick={onToggle}
                    className="text-zinc-500 hover:text-zinc-300 text-xs font-bold uppercase tracking-wide ml-1 transition-colors duration-200"
                >
                    {shouldTruncate ? 'more' : 'less'}
                </button>
            </>
        );
    };

    const canEdit = canEditPost(post, user);
    const canDelete = canDeletePost(post, user);
    const showMenu = canEdit || canDelete;

    return (
        <article className="group relative bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden mb-6 transition-all hover:border-white/10 hover:shadow-2xl hover:shadow-black/50">
            
            {/* 1. Header */}
            <header className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleProfileClick(post.user.id)}
                        className="relative group/avatar"
                        disabled={isLoadingProfile}
                    >
                        <div className="w-10 h-10 rounded-full p-[1px] bg-gradient-to-tr from-white/20 to-transparent group-hover/avatar:from-white/50 transition-all">
                            <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center overflow-hidden border border-black/50">
                                {isLoadingProfile ? (
                                    <div className="scale-75"><LoadingSpinner /></div>
                                ) : (
                                    <span className="text-sm font-bold text-zinc-300 group-hover/avatar:text-white">
                                        {post.user.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </button>
                    <div className="flex flex-col">
                        <button
                            onClick={() => handleProfileClick(post.user.id)}
                            className="text-sm font-semibold text-zinc-200 hover:text-white text-left disabled:opacity-50 transition-colors"
                            disabled={isLoadingProfile}
                        >
                            {post.user.name}
                        </button>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                            <span>{formatDate(post.created_at)}</span>
                            {post.kategori && (
                                <>
                                    <span className="w-0.5 h-0.5 bg-zinc-600 rounded-full" />
                                    <span className="text-emerald-500">{post.kategori}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Context Menu */}
                {showActions && showMenu && (
                    <div className="relative">
                        <button
                            onClick={() => setShowPostMenu(showPostMenu === post.id ? null : post.id)}
                            className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                        
                        {showPostMenu === post.id && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                {canEdit && (
                                    <button
                                        onClick={() => {
                                            setEditingPost({ ...post }); // Simplified
                                            setShowPostMenu(null);
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white flex items-center transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4 mr-3" /> Edit Post
                                    </button>
                                )}
                                {canDelete && (
                                    <button
                                        onClick={() => {
                                            setShowDeleteConfirm(post.id);
                                            setShowPostMenu(null);
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-rose-500 hover:bg-rose-500/10 flex items-center transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 mr-3" /> Hapus Post
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* 2. Media Content */}
            {post.files && Array.isArray(post.files) && post.files.length > 0 && (
                <div className="relative w-full bg-black/50 border-y border-white/5">
                    {isLoadingPost && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                            <LoadingSpinner />
                        </div>
                    )}
                    
                    {post.files.length === 1 ? (
                        <div className="w-full relative group/image">
                            {post.files[0].mime_type?.startsWith('image/') ? (
                                <div className="relative w-full">
                                    {imageLoading.has(post.files[0].id) && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                                            <Loader className="w-6 h-6 animate-spin text-zinc-600" />
                                        </div>
                                    )}
                                    <img
                                        src={post.files[0].file_url}
                                        alt="Content"
                                        className={`w-full h-auto max-h-[600px] object-contain mx-auto transition-opacity duration-300 ${
                                            imageLoading.has(post.files[0].id) ? 'opacity-0' : 'opacity-100'
                                        }`}
                                        onDoubleClick={() => !isLoadingPost && handleLike(post.id)}
                                        onClick={() => !isLoadingPost && handlePostClick(post.id)}
                                        onLoadStart={() => handleImageLoadStart(post.files[0].id)}
                                        onLoad={() => handleImageLoad(post.files[0].id)}
                                        onError={() => handleImageError(post.files[0].id)}
                                    />
                                    {imageErrors.has(post.files[0].id) && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 text-zinc-500">
                                            <Camera className="w-10 h-10 mb-2 opacity-50" />
                                            <span className="text-xs">Gagal memuat gambar</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div 
                                    className="w-full aspect-video flex flex-col items-center justify-center bg-zinc-900 cursor-pointer hover:bg-zinc-800 transition-colors"
                                    onClick={() => !isLoadingPost && handlePostClick(post.id)}
                                >
                                    <FileText className="w-16 h-16 text-zinc-700 mb-4" />
                                    <p className="text-sm text-zinc-400 font-medium">{post.files[0].original_name}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Grid Layout for multiple images
                        <div 
                            className="grid grid-cols-2 gap-0.5 w-full cursor-pointer"
                            onClick={() => !isLoadingPost && handlePostClick(post.id)}
                        >
                            {post.files.slice(0, 4).map((file, index) => (
                                <div key={file.id} className="relative aspect-square bg-zinc-900 overflow-hidden">
                                    {file.mime_type?.startsWith('image/') ? (
                                        <>
                                            <img
                                                src={file.file_url}
                                                alt={`Gallery ${index}`}
                                                className={`w-full h-full object-cover transition-all duration-500 hover:scale-110 hover:opacity-80 ${
                                                    imageLoading.has(file.id) ? 'opacity-0' : 'opacity-100'
                                                }`}
                                                onLoad={() => handleImageLoad(file.id)}
                                                onError={() => handleImageError(file.id)}
                                            />
                                            {imageLoading.has(file.id) && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Loader className="w-4 h-4 animate-spin text-zinc-600" />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                            <FileText className="w-8 h-8" />
                                        </div>
                                    )}
                                    
                                    {/* Overlay for +more images */}
                                    {index === 3 && post.files.length > 4 && (
                                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                                            <span className="text-white font-bold text-xl tracking-tighter">+{post.files.length - 4}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* 3. Actions & Content */}
            <div className="p-4">
                {/* Icons */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleLike(post.id)}
                            className="group/like transition-transform active:scale-95"
                        >
                            <Heart className={`w-6 h-6 transition-colors ${
                                post.is_liked 
                                ? 'fill-rose-500 text-rose-500' 
                                : 'text-zinc-400 group-hover/like:text-white'
                            }`} />
                        </button>
                        <button
                            onClick={() => handlePostClick(post.id)}
                            disabled={isLoadingPost}
                            className="group/comment transition-transform active:scale-95 disabled:opacity-50"
                        >
                            <MessageCircle className="w-6 h-6 text-zinc-400 group-hover/comment:text-white transition-colors" />
                        </button>
                    </div>
                    <button className="group/save transition-transform active:scale-95">
                        <Bookmark className="w-6 h-6 text-zinc-400 group-hover/save:text-white transition-colors" />
                    </button>
                </div>

                {/* Likes */}
                {post.likes_count > 0 && (
                    <div className="mb-2">
                        <span className="text-sm font-bold text-white">
                            {post.likes_count} likes
                        </span>
                    </div>
                )}

                {/* Caption */}
                {post.caption && (
                    <div className="mb-3">
                        <div className="text-sm leading-relaxed text-zinc-300">
                            <span className="font-bold text-white mr-2">{post.user.name}</span>
                            {renderExpandableText(
                                post.caption,
                                CAPTION_LIMIT,
                                isCaptionExpanded,
                                () => setIsCaptionExpanded(!isCaptionExpanded),
                                "text-zinc-300 break-words whitespace-pre-wrap"
                            )}
                        </div>
                        {post.tags && (
                            <p className="mt-1 text-xs font-medium text-blue-400 break-words">{post.tags}</p>
                        )}
                    </div>
                )}

                {/* Comments Section */}
                {post.latest_comments && post.latest_comments.length > 0 && (
                    <div className="space-y-1">
                        {post.comments_count > post.latest_comments.length && (
                            <button
                                onClick={() => handlePostClick(post.id)}
                                disabled={isLoadingPost}
                                className="text-xs text-zinc-500 hover:text-zinc-300 font-medium mb-1 transition-colors"
                            >
                                {isLoadingPost ? 'Loading...' : `View all ${post.comments_count} comments`}
                            </button>
                        )}
                        {post.latest_comments.map(comment => (
                            <div key={comment.id} className="text-sm text-zinc-400">
                                <span className="font-bold text-zinc-200 mr-2">{comment.user.name}</span>
                                {renderExpandableText(
                                    comment.comment,
                                    COMMENT_LIMIT,
                                    expandedComments.has(comment.id),
                                    () => toggleCommentExpansion(comment.id),
                                    "break-words"
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
};

export default PostCard;