import React, { useState } from 'react';
import { 
    X, Heart, Send, MessageCircle, Camera, Eye, 
    Trash2, MoreHorizontal, Edit3, Bookmark, 
    ChevronLeft, ChevronRight, FileText, CornerDownRight 
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { canEditPost } from '../../utils/postUtils';

// --- KOMPONEN DIPINDAHKAN KELUAR (FIXED) ---

const MediaViewer = ({ selectedPost, currentImageIndex, setCurrentImageIndex, nextImage, prevImage, isMobile = false }) => (
    <div className={`relative bg-black/40 flex items-center justify-center overflow-hidden ${isMobile ? 'aspect-square w-full' : 'flex-1 h-full'}`}>
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

        {selectedPost.files && selectedPost.files.length > 0 ? (
            <>
                <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                    {selectedPost.files[currentImageIndex].mime_type?.startsWith('image/') ? (
                        <img
                            src={selectedPost.files[currentImageIndex].file_url}
                            alt="Post content"
                            className="max-w-full max-h-full object-contain shadow-2xl"
                        />
                    ) : (
                        <div className="text-center p-8 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-md">
                            <FileText className="w-12 h-12 mx-auto mb-4 text-zinc-500" />
                            <p className="text-sm text-zinc-300 mb-1 font-medium">{selectedPost.files[currentImageIndex].original_name}</p>
                            <p className="text-xs text-zinc-600 mb-4">
                                {selectedPost.files[currentImageIndex].file_size ? `${(selectedPost.files[currentImageIndex].file_size / 1024).toFixed(1)} KB` : 'Unknown size'}
                            </p>
                            <a
                                href={selectedPost.files[currentImageIndex].file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-zinc-200 transition-colors"
                            >
                                <Eye className="w-3 h-3 mr-2" />
                                Open File
                            </a>
                        </div>
                    )}
                </div>

                {/* Navigation Arrows */}
                {selectedPost.files.length > 1 && (
                    <>
                        <button onClick={(e) => {e.stopPropagation(); prevImage();}} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 z-20">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={(e) => {e.stopPropagation(); nextImage();}} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 z-20">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        {/* Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 z-20">
                            {selectedPost.files.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {e.stopPropagation(); setCurrentImageIndex(index);}}
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white w-3' : 'bg-white/30 hover:bg-white/50'}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </>
        ) : (
            <div className="text-center text-zinc-600">
                <Camera className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="text-xs uppercase tracking-widest">No Media</p>
            </div>
        )}
    </div>
);

const UserHeader = ({ 
    selectedPost, 
    user, 
    showPostMenu, 
    setShowPostMenu, 
    setEditingPost, 
    setSelectedPost, 
    setShowDeleteConfirm 
}) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                {selectedPost.user.name.charAt(0).toUpperCase()}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-white leading-none">{selectedPost.user.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-zinc-500">{formatDate(selectedPost.created_at)}</span>
                    {selectedPost.kategori && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium">
                            {selectedPost.kategori}
                        </span>
                    )}
                </div>
            </div>
        </div>

        <div className="flex items-center gap-1">
            {canEditPost(selectedPost, user) && (
                <div className="relative">
                    <button
                        onClick={() => setShowPostMenu(!showPostMenu)}
                        className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                    >
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {showPostMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowPostMenu(false)}></div>
                            <div className="absolute right-0 top-full mt-2 w-40 bg-[#18181b] border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden ring-1 ring-black/50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-1">
                                    <button
                                        onClick={() => {
                                            setEditingPost({ id: selectedPost.id, caption: selectedPost.caption, kategori: selectedPost.kategori, tags: selectedPost.tags });
                                            setShowPostMenu(false); setSelectedPost(null);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" /> Edit Post
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDeleteConfirm(selectedPost.id);
                                            setShowPostMenu(false); setSelectedPost(null);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
            <button
                onClick={() => setSelectedPost(null)}
                className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    </div>
);

const CommentInput = ({ user, localComment, setLocalComment, handleCommentSubmit, selectedPost }) => (
    <div className="p-4 bg-[#09090b] border-t border-white/5 flex items-center gap-3">
         <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-400 flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex-1 relative">
            <input
                type="text"
                placeholder="Add a comment..."
                value={localComment}
                onChange={(e) => setLocalComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(selectedPost.id)}
                className="w-full bg-zinc-900 border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 focus:bg-zinc-900/80 transition-all"
            />
            {localComment.trim() && (
                <button
                    onClick={() => handleCommentSubmit(selectedPost.id)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-white text-black rounded-full hover:bg-zinc-200 transition-colors"
                >
                    <Send className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    </div>
);

// --- MAIN COMPONENT ---

const PostDetailModal = ({
    selectedPost,
    setSelectedPost,
    user,
    handleLike,
    handleComment,
    handleDeleteComment,
    newComment,
    setNewComment,
    setEditingPost,
    setShowDeleteConfirm
}) => {
    const [localComment, setLocalComment] = useState('');
    const [showPostMenu, setShowPostMenu] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [expandedComments, setExpandedComments] = useState(new Set());
    const [expandedCaption, setExpandedCaption] = useState(false);

    const handleCommentSubmit = (postId) => {
        if (localComment.trim()) {
            handleComment(postId, localComment);
            setLocalComment('');
        }
    };

    const nextImage = () => {
        if (selectedPost.files && selectedPost.files.length > 1) {
            setCurrentImageIndex((prev) =>
                prev === selectedPost.files.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (selectedPost.files && selectedPost.files.length > 1) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? selectedPost.files.length - 1 : prev - 1
            );
        }
    };

    const toggleCommentExpansion = (commentId) => {
        const newExpanded = new Set(expandedComments);
        if (newExpanded.has(commentId)) {
            newExpanded.delete(commentId);
        } else {
            newExpanded.add(commentId);
        }
        setExpandedComments(newExpanded);
    };

    // Helper: Truncate Text logic
    const renderTextWithExpansion = (text, id, isExpanded, onToggle, maxLength = 100) => {
        if (!text || text.length <= maxLength) return <span className="text-zinc-300">{text}</span>;

        return (
            <span className="text-zinc-300">
                {isExpanded ? text : text.substring(0, maxLength) + '...'}
                <button
                    onClick={() => onToggle(id)}
                    className="ml-1 text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-wider transition-colors"
                >
                    {isExpanded ? 'Show Less' : 'More'}
                </button>
            </span>
        );
    };

    if (!selectedPost) return null;

    return (
        <>
            {/* === DESKTOP MODAL === */}
            <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center p-6">
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                    onClick={() => setSelectedPost(null)}
                />
                
                {/* Modal Container */}
                <div className="relative w-full max-w-6xl h-[85vh] bg-[#09090b] border border-white/10 rounded-3xl shadow-2xl flex overflow-hidden animate-in zoom-in-95 duration-300">
                    
                    {/* LEFT: Media */}
                    <MediaViewer 
                        selectedPost={selectedPost}
                        currentImageIndex={currentImageIndex}
                        setCurrentImageIndex={setCurrentImageIndex}
                        nextImage={nextImage}
                        prevImage={prevImage}
                    />

                    {/* RIGHT: Details & Comments */}
                    <div className="w-[400px] flex flex-col bg-[#09090b] border-l border-white/10 relative z-10">
                        {/* Header */}
                        <div className="p-5 border-b border-white/5 bg-[#09090b]/95 backdrop-blur-sm z-20">
                            <UserHeader 
                                selectedPost={selectedPost}
                                user={user}
                                showPostMenu={showPostMenu}
                                setShowPostMenu={setShowPostMenu}
                                setEditingPost={setEditingPost}
                                setSelectedPost={setSelectedPost}
                                setShowDeleteConfirm={setShowDeleteConfirm}
                            />
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {/* Caption Section */}
                            {(selectedPost.caption || selectedPost.tags) && (
                                <div className="p-5 border-b border-white/5">
                                    {selectedPost.caption && (
                                        <div className="flex gap-3 mb-2">
                                            <div className="w-8 h-8 flex-shrink-0" /> {/* Spacer for alignment */}
                                            <div className="text-sm leading-relaxed">
                                                {renderTextWithExpansion(selectedPost.caption, 'caption', expandedCaption, () => setExpandedCaption(!expandedCaption))}
                                            </div>
                                        </div>
                                    )}
                                    {selectedPost.tags && (
                                        <div className="ml-11 mt-2">
                                            <span className="text-xs text-indigo-400 font-medium">{selectedPost.tags}</span>
                                        </div>
                                    )}
                                    
                                    {/* Action Bar inside Scroll Area */}
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleLike(selectedPost.id)}
                                                className="group flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
                                            >
                                                <Heart className={`w-5 h-5 transition-all ${selectedPost.likes?.is_liked ? 'fill-red-500 text-red-500 scale-110' : 'group-hover:scale-110'}`} />
                                            </button>
                                            <button className="text-zinc-400 hover:text-white transition-colors">
                                                <MessageCircle className="w-5 h-5 hover:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                        <button className="text-zinc-400 hover:text-white transition-colors">
                                            <Bookmark className="w-5 h-5 hover:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                    <div className="mt-2 text-xs font-bold text-white">
                                        {selectedPost.likes?.count || 0} Likes
                                    </div>
                                </div>
                            )}

                            {/* Comments List */}
                            <div className="p-5">
                                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Comments ({selectedPost.comments?.length || 0})</h4>
                                
                                {selectedPost.comments && selectedPost.comments.length > 0 ? (
                                    <div className="space-y-4">
                                        {selectedPost.comments.map(comment => (
                                            <div key={comment.id} className="group flex gap-3">
                                                 <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center text-xs font-bold text-zinc-400 flex-shrink-0">
                                                    {comment.user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-baseline justify-between">
                                                        <span className="text-xs font-bold text-white mr-2">{comment.user.name}</span>
                                                        <span className="text-[10px] text-zinc-600">{formatDate(comment.created_at)}</span>
                                                    </div>
                                                    <div className="text-sm text-zinc-400 mt-0.5 leading-relaxed">
                                                        {renderTextWithExpansion(comment.comment, comment.id, expandedComments.has(comment.id), toggleCommentExpansion, 80)}
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {(comment.user.id === user?.id || canEditPost(selectedPost, user)) && (
                                                            <button
                                                                onClick={() => handleDeleteComment(comment.id)}
                                                                className="text-[10px] text-zinc-500 hover:text-red-400 flex items-center gap-1"
                                                            >
                                                                <Trash2 className="w-3 h-3" /> Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-10 text-center opacity-40">
                                        <MessageCircle className="w-10 h-10 mx-auto text-zinc-500 mb-2" />
                                        <p className="text-xs text-zinc-500">No comments yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Input */}
                        <CommentInput 
                            user={user}
                            localComment={localComment}
                            setLocalComment={setLocalComment}
                            handleCommentSubmit={handleCommentSubmit}
                            selectedPost={selectedPost}
                        />
                    </div>
                </div>
            </div>

            {/* === MOBILE FULL SCREEN === */}
            <div className="lg:hidden fixed inset-0 z-50 bg-[#09090b] flex flex-col animate-in slide-in-from-bottom-full duration-300">
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-30">
                    <UserHeader 
                        selectedPost={selectedPost}
                        user={user}
                        showPostMenu={showPostMenu}
                        setShowPostMenu={setShowPostMenu}
                        setEditingPost={setEditingPost}
                        setSelectedPost={setSelectedPost}
                        setShowDeleteConfirm={setShowDeleteConfirm}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto pb-20">
                    {/* Media */}
                    <MediaViewer 
                        selectedPost={selectedPost}
                        currentImageIndex={currentImageIndex}
                        setCurrentImageIndex={setCurrentImageIndex}
                        nextImage={nextImage}
                        prevImage={prevImage}
                        isMobile={true}
                    />

                    {/* Details */}
                    <div className="px-4 py-3">
                        {/* Actions */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleLike(selectedPost.id)}
                                    className="group text-zinc-400 hover:text-white"
                                >
                                    <Heart className={`w-6 h-6 transition-all ${selectedPost.likes?.is_liked ? 'fill-red-500 text-red-500' : ''}`} />
                                </button>
                                <button className="text-zinc-400">
                                    <MessageCircle className="w-6 h-6" />
                                </button>
                                <button className="text-zinc-400">
                                    <Send className="w-6 h-6 -rotate-45" />
                                </button>
                            </div>
                            <button className="text-zinc-400">
                                <Bookmark className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="text-sm font-bold text-white mb-2">
                            {selectedPost.likes?.count || 0} Likes
                        </div>

                        {/* Caption */}
                        {selectedPost.caption && (
                            <div className="mb-2">
                                <span className="text-sm font-bold text-white mr-2">{selectedPost.user.name}</span>
                                <span className="text-sm text-zinc-300">
                                    {renderTextWithExpansion(selectedPost.caption, 'mobile-caption', expandedCaption, () => setExpandedCaption(!expandedCaption), 100)}
                                </span>
                            </div>
                        )}
                        {selectedPost.tags && (
                            <div className="text-xs text-indigo-400 mb-4">{selectedPost.tags}</div>
                        )}

                        {/* Comments Preview/List */}
                        <div className="border-t border-white/5 pt-4">
                            <h4 className="text-xs text-zinc-500 mb-3">Comments ({selectedPost.comments?.length || 0})</h4>
                            {selectedPost.comments?.map(comment => (
                                <div key={comment.id} className="flex gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center text-xs font-bold text-zinc-400 flex-shrink-0">
                                        {comment.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-xs font-bold text-white">{comment.user.name}</span>
                                            <span className="text-[10px] text-zinc-600">{formatDate(comment.created_at)}</span>
                                        </div>
                                        <p className="text-sm text-zinc-300 mt-0.5">
                                            {renderTextWithExpansion(comment.comment, `mob-${comment.id}`, expandedComments.has(comment.id), toggleCommentExpansion, 80)}
                                        </p>
                                        {(comment.user.id === user?.id || canEditPost(selectedPost, user)) && (
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="mt-1 text-[10px] text-red-400 flex items-center gap-1"
                                            >
                                                <Trash2 className="w-3 h-3" /> Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Input Fixed Bottom */}
                <div className="sticky bottom-0 left-0 right-0 z-30">
                     <CommentInput 
                        user={user}
                        localComment={localComment}
                        setLocalComment={setLocalComment}
                        handleCommentSubmit={handleCommentSubmit}
                        selectedPost={selectedPost}
                    />
                </div>
            </div>
        </>
    );
};

export default PostDetailModal;