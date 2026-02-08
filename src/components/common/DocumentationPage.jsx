// src/App.js
import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { Camera, LayoutDashboard, Plus, Search, AlertCircle } from 'lucide-react';
import PostCard from '../documentation/PostCard';
import TrendingView from '../documentation/TrendingView';
import ProfileView from '../documentation/ProfileView';
import SearchView from '../documentation/SearchView';
import CreatePostModal from '../documentation/CreatePostModal';
import EditPostModal from '../documentation/EditPostModal';
import DeleteConfirmModal from '../documentation/DeleteConfirmModal';
import PostDetailModal from '../documentation/PostDetailModal';
import Navbar from '../documentation/Navbar';
import SearchBar from '../documentation/SearchBar';
import LoadingSpinner from '../Ui/LoadingSpinner';

const DocumentationPage = () => {
    const { user, loading: authLoading } = useAuth();
    const [currentPage, setCurrentPage] = useState('feed');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    // State untuk posting
    const [showCreatePost, setShowCreatePost] = useState(false);

    // State untuk feed
    const [feedFilters, setFeedFilters] = useState({
        kategori: '',
        search: '',
        page: 1
    });

    // State untuk detail post
    const [selectedPost, setSelectedPost] = useState(null);
    const [newComment, setNewComment] = useState('');

    // State untuk trending
    const [trendingPosts, setTrendingPosts] = useState([]);

    // State untuk profile
    const [userStats, setUserStats] = useState({ posts_count: 0, total_likes_received: 0 });
    const [userPosts, setUserPosts] = useState([]);
    const [profileUserId, setProfileUserId] = useState(null);
    const [profilePage, setProfilePage] = useState(1);
    const [profileHasMore, setProfileHasMore] = useState(false);

    // State untuk edit/delete
    const [showPostMenu, setShowPostMenu] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    // State untuk search
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        if (user) {
            loadFeed();
            loadCategories();
        }
    }, [user]);

    useEffect(() => {
        if (user && currentPage === 'feed') {
            loadFeed();
        } else if (user && currentPage === 'trending') {
            loadTrending();
        } else if (user && currentPage === 'search' && feedFilters.search) {
            performSearch();
        }
    }, [currentPage, feedFilters, user]);

    const loadFeed = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (feedFilters.kategori) params.append('kategori', feedFilters.kategori);
            if (feedFilters.search) params.append('search', feedFilters.search);
            params.append('page', feedFilters.page);
            params.append('limit', '10');
            const response = await api.get(`/dokumentasi/?${params}`);
            if (feedFilters.page === 1) {
                setPosts(response.data.data);
            } else {
                setPosts(prev => [...prev, ...response.data.data]);
            }
        } catch (error) {
            console.error('Error loading feed:', error);
        }
        setLoading(false);
    };

    const loadCategories = async () => {
        try {
            const response = await api.get('/dokumentasi/categories');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error loading categories:', error);
            setCategories([
                { name: 'umum', count: 0 },
                { name: 'pekerjaan', count: 0 },
                { name: 'tutorial', count: 0 },
                { name: 'meeting', count: 0 },
                { name: 'proyek', count: 0 }
            ]);
        }
    };

    const loadTrending = async () => {
        setLoading(true);
        try {
            const response = await api.get('/dokumentasi/trending?limit=20');
            setTrendingPosts(response.data.data);
        } catch (error) {
            console.error('Error loading trending:', error);
        }
        setLoading(false);
    };

    const loadUserProfile = async (userId = null, page = 1, append = false) => {
        if (page === 1) setLoading(true);
        const targetUserId = userId || user.id;
        setProfileUserId(targetUserId);

        try {
            const [statsResponse, postsResponse] = await Promise.all([
                api.get(`/dokumentasi/${targetUserId}/stats`),
                api.get(`/dokumentasi/${targetUserId}/user?page=${page}&limit=12`)
            ]);

            setUserStats(statsResponse.data.data);

            const { data: newPosts, pagination } = postsResponse.data;

            if (append && page > 1) {
                setUserPosts(prevPosts => [...prevPosts, ...newPosts]);
            } else {
                setUserPosts(newPosts);
            }

            setProfilePage(pagination.page);
            setProfileHasMore(pagination.has_more);

        } catch (error) {
            console.error('Error loading user profile:', error);
        }

        setLoading(false);
    };

    const loadMoreProfilePosts = async () => {
        if (!profileHasMore) return;
        const nextPage = profilePage + 1;
        await loadUserProfile(profileUserId, nextPage, true);
    };

    const handleProfileNavigation = async (userId = null) => {
        setProfilePage(1);
        setProfileHasMore(false);
        setUserPosts([]);
        await loadUserProfile(userId, 1, false);
        setCurrentPage('profile');
    };

    const performSearch = async () => {
        if (!feedFilters.search.trim()) return;
        setSearchLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('search', feedFilters.search);
            if (feedFilters.kategori) params.append('kategori', feedFilters.kategori);
            params.append('page', feedFilters.page);
            params.append('limit', '10');

            const response = await api.get(`/dokumentasi/?${params}`);

            if (feedFilters.page === 1) {
                setSearchResults(response.data.data);
            } else {
                setSearchResults(prev => [...prev, ...response.data.data]);
            }
        } catch (error) {
            console.error('Error searching:', error);
        }
        setSearchLoading(false);
    };

    const handleCreatePost = async (postData) => {
        try {
            const formData = new FormData();
            formData.append('caption', postData.caption);
            formData.append('kategori', postData.kategori);
            formData.append('tags', postData.tags);

            if (postData.files && postData.files.length > 0) {
                postData.files.forEach(file => {
                    formData.append('files', file);
                });
            }

            await api.post('/dokumentasi', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (currentPage === 'feed') {
                setFeedFilters(prev => ({ ...prev, page: 1 }));
                loadFeed();
            } else if (currentPage === 'profile' && profileUserId === user.id) {
                loadUserProfile();
            }
        } catch (error) {
            console.error('Error creating post:', error);
            throw new Error('Gagal membuat post. Silakan coba lagi.');
        }
    };

    const handleEditPost = async () => {
        if (!editingPost) return;
        try {
            await api.put(`/dokumentasi/${editingPost.id}`, {
                caption: editingPost.caption,
                kategori: editingPost.kategori,
                tags: editingPost.tags
            });
            const updatePosts = (posts) => posts.map(post =>
                post.id === editingPost.id
                    ? { ...post, ...editingPost, updated_at: new Date().toISOString() }
                    : post
            );
            setPosts(updatePosts);
            setUserPosts(updatePosts);
            setTrendingPosts(updatePosts);
            setSearchResults(updatePosts);
            if (selectedPost && selectedPost.id === editingPost.id) {
                setSelectedPost({ ...selectedPost, ...editingPost });
            }
            setEditingPost(null);
            setShowPostMenu(null);
            // alert('Post berhasil diupdate!'); 
        } catch (error) {
            console.error('Error updating post:', error);
            // alert('Gagal mengupdate post');
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await api.delete(`/dokumentasi/${postId}`);
            const filterPosts = (posts) => posts.filter(post => post.id !== postId);
            setPosts(filterPosts);
            setUserPosts(filterPosts);
            setTrendingPosts(filterPosts);
            setSearchResults(filterPosts);
            if (selectedPost && selectedPost.id === postId) {
                setSelectedPost(null);
            }
            setShowDeleteConfirm(null);
            setShowPostMenu(null);
            // alert('Post berhasil dihapus!');
        } catch (error) {
            console.error('Error deleting post:', error);
            // alert('Gagal menghapus post');
        }
    };

    const handleLike = async (postId) => {
        try {
            const response = await api.post(`/dokumentasi/${postId}/like`);
            const action = response.data.action;
            const updatePosts = (posts) => posts.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        likes_count: action === 'liked' ? post.likes_count + 1 : post.likes_count - 1,
                        is_liked: action === 'liked'
                    }
                    : post
            );
            setPosts(updatePosts);
            setUserPosts(updatePosts);
            setTrendingPosts(updatePosts);
            setSearchResults(updatePosts);
            if (selectedPost && selectedPost.id === postId) {
                setSelectedPost(prev => ({
                    ...prev,
                    likes: {
                        ...prev.likes,
                        count: action === 'liked' ? prev.likes.count + 1 : prev.likes.count - 1,
                        is_liked: action === 'liked'
                    }
                }));
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleComment = async (postId, commentText) => {
        if (!commentText.trim()) return;
        try {
            const response = await api.post(`/dokumentasi/${postId}/comment`, {
                comment: commentText
            });
            const updatePosts = (posts) => posts.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        comments_count: post.comments_count + 1,
                        latest_comments: [response.data.data, ...(post.latest_comments || [])].slice(0, 3)
                    }
                    : post
            );
            setPosts(updatePosts);
            setUserPosts(updatePosts);
            setSearchResults(updatePosts);
            if (selectedPost && selectedPost.id === postId) {
                setSelectedPost(prev => ({
                    ...prev,
                    comments: [response.data.data, ...prev.comments]
                }));
            }
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/dokumentasi/${commentId}/comment`);
            if (selectedPost) {
                setSelectedPost(prev => ({
                    ...prev,
                    comments: prev.comments.filter(comment => comment.id !== commentId)
                }));
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const openPostDetail = async (postId) => {
        try {
            const response = await api.get(`/dokumentasi/${postId}`);
            setSelectedPost(response.data.data);
        } catch (error) {
            console.error('Error loading post detail:', error);
        }
    };

    const handleSearch = (searchTerm) => {
        setFeedFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
        if (searchTerm.trim()) {
            setCurrentPage('search');
        } else {
            setCurrentPage('feed');
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                        <AlertCircle className="w-8 h-8 text-zinc-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Akses Terbatas</h1>
                    <p className="text-zinc-500 mb-8 text-sm">
                        Silakan login akun anda untuk mengakses sistem dokumentasi.
                    </p>
                    <button className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors">
                        Login Sekarang
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-zinc-200 font-sans selection:bg-white/20 pb-20">
            <Navbar
                user={user}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setFeedFilters={setFeedFilters}
                setShowCreatePost={setShowCreatePost}
                loadUserProfile={handleProfileNavigation}
            />

            <main className="max-w-5xl mx-auto pt-6 px-4 md:px-8">
                
                {/* Header Feed */}
                {currentPage === 'feed' && (
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
                                    <LayoutDashboard className="w-5 h-5 text-zinc-400" />
                                </div>
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                                    Team Updates
                                </p>
                            </div>
                            <h1 className="text-3xl font-light tracking-tight text-white">
                                Dokumentasi <span className="font-semibold text-zinc-400">Kegiatan</span>
                            </h1>
                        </div>
                    </div>
                )}

                {/* Search Bar Wrapper */}
                {(currentPage === 'feed' || currentPage === 'search') && (
                    <div className="mb-8">
                        <SearchBar
                            feedFilters={feedFilters}
                            categories={categories}
                            handleSearch={handleSearch}
                            setFeedFilters={setFeedFilters}
                        />
                    </div>
                )}

                {/* --- FEED VIEW --- */}
                {currentPage === 'feed' && (
                    <div className="space-y-6">
                        {loading && posts.length === 0 ? (
                            <div className="flex justify-center py-20">
                                <LoadingSpinner />
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-zinc-900/20">
                                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
                                    <Camera className="w-6 h-6 text-zinc-600" />
                                </div>
                                <h3 className="text-white font-medium mb-1">Belum ada dokumentasi</h3>
                                <p className="text-zinc-500 text-sm mb-6">Mulai dokumentasikan aktivitas kamu!</p>
                                <button
                                    onClick={() => setShowCreatePost(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-zinc-200 transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    Buat Post Pertama
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-6">
                                    {posts.map(post => (
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
                                
                                {!loading && (
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
                )}

                {/* --- TRENDING VIEW --- */}
                {currentPage === 'trending' && (
                    <TrendingView
                        trendingPosts={trendingPosts}
                        loading={loading}
                        openPostDetail={openPostDetail}
                        setCurrentPage={setCurrentPage}
                        loadUserProfile={loadUserProfile}
                    />
                )}

                {/* --- PROFILE VIEW --- */}
                {currentPage === 'profile' && (
                    <ProfileView
                        user={user}
                        profileUserId={profileUserId}
                        userStats={userStats}
                        userPosts={userPosts}
                        loading={loading}
                        setShowCreatePost={setShowCreatePost}
                        openPostDetail={openPostDetail}
                        onLoadMorePosts={profileHasMore ? loadMoreProfilePosts : null}
                    />
                )}

                {/* --- SEARCH VIEW --- */}
                {currentPage === 'search' && (
                    <SearchView
                        feedFilters={feedFilters}
                        searchResults={searchResults}
                        searchLoading={searchLoading}
                        setFeedFilters={setFeedFilters}
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
                )}
            </main>

            {/* --- MODALS --- */}
            <CreatePostModal
                showCreatePost={showCreatePost}
                setShowCreatePost={setShowCreatePost}
                categories={categories}
                handleCreatePost={handleCreatePost}
            />
            <EditPostModal
                editingPost={editingPost}
                setEditingPost={setEditingPost}
                categories={categories}
                handleEditPost={handleEditPost}
            />
            <DeleteConfirmModal
                showDeleteConfirm={showDeleteConfirm}
                setShowDeleteConfirm={setShowDeleteConfirm}
                handleDeletePost={handleDeletePost}
            />
            <PostDetailModal
                selectedPost={selectedPost}
                setSelectedPost={setSelectedPost}
                user={user}
                handleLike={handleLike}
                handleComment={handleComment}
                handleDeleteComment={handleDeleteComment}
                newComment={newComment}
                setNewComment={setNewComment}
                setEditingPost={setEditingPost}
                setShowDeleteConfirm={setShowDeleteConfirm}
            />
        </div>
    );
};

export default DocumentationPage;