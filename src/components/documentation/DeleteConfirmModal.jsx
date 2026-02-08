import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const DeleteConfirmModal = ({
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleDeletePost
}) => {
    if (!showDeleteConfirm) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-black border border-neutral-800 rounded-2xl w-full max-w-md">
                <div className="p-6 text-center">
                    <AlertCircle className="w-16 h-16 text-white mx-auto mb-4" />
                    <h2 className="text-lg font-semibold mb-2 text-white">Hapus Post?</h2>
                    <p className="text-neutral-400 mb-6">
                        Post ini akan dihapus permanen. Aksi ini tidak dapat dibatalkan.
                    </p>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="flex-1 py-2 border border-neutral-700 text-white rounded-lg hover:bg-neutral-900"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => handleDeletePost(showDeleteConfirm)}
                            className="flex-1 py-2 bg-white text-black rounded-lg hover:bg-neutral-200"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;