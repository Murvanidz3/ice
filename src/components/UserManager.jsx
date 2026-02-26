import { useState, useRef, useEffect } from 'react';

export default function UserManager({ users, addUser, deleteUser, updateUserPassword, onClose }) {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [editPassword, setEditPassword] = useState('');
    const inputRef = useRef(null);
    const editRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    useEffect(() => {
        if (editingUser && editRef.current) {
            editRef.current.focus();
            editRef.current.select();
        }
    }, [editingUser]);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const handleAdd = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!newUsername.trim()) { setError('შეიყვანეთ მომხმარებლის სახელი'); return; }
        if (!newPassword.trim()) { setError('შეიყვანეთ პაროლი'); return; }
        if (newPassword.trim().length < 3) { setError('პაროლი მინიმუმ 3 სიმბოლო უნდა იყოს'); return; }

        const ok = addUser(newUsername.trim(), newPassword.trim());
        if (!ok) {
            setError('ეს მომხმარებელი უკვე არსებობს');
            return;
        }
        setSuccess(`მომხმარებელი "${newUsername.trim()}" წარმატებით შეიქმნა`);
        setNewUsername('');
        setNewPassword('');
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleDelete = (username) => {
        if (username === 'admin') return;
        deleteUser(username);
    };

    const handlePasswordSave = (username) => {
        if (editPassword.trim().length >= 3) {
            updateUserPassword(username, editPassword.trim());
            setEditingUser(null);
            setEditPassword('');
            setSuccess(`"${username}" — პაროლი შეიცვალა`);
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const nonAdminUsers = users.filter((u) => !u.isAdmin);

    return (
        <div
            className="fixed inset-0 z-[100] glass-modal-backdrop flex items-start justify-center pt-12 pb-12 overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="glass-modal rounded-2xl w-full max-w-[560px] mx-4 shadow-2xl animate-slide-up relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-ice-500 to-ice-600 rounded-t-2xl px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <h2 className="text-white font-bold text-lg">მომხმარებლების მართვა</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    {/* Add User Form */}
                    <form onSubmit={handleAdd} className="mb-6">
                        <h3 className="text-sm font-semibold text-frost-700 mb-3">ახალი მომხმარებლის დამატება</h3>
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="მომხმარებლის სახელი"
                                className="flex-1 bg-frost-50 border border-frost-200 text-frost-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ice-400/50 focus:border-ice-400 transition-all placeholder:text-frost-300"
                            />
                            <input
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="პაროლი"
                                type="password"
                                className="flex-1 bg-frost-50 border border-frost-200 text-frost-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ice-400/50 focus:border-ice-400 transition-all placeholder:text-frost-300"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2.5 bg-ice-500 hover:bg-ice-600 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer shrink-0"
                            >
                                დამატება
                            </button>
                        </div>

                        {error && (
                            <div className="mt-2 text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2 animate-fade-in flex items-center gap-2">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mt-2 text-emerald-600 text-sm bg-emerald-50 rounded-lg px-3 py-2 animate-fade-in flex items-center gap-2">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                {success}
                            </div>
                        )}
                    </form>

                    {/* User List */}
                    <div>
                        <h3 className="text-sm font-semibold text-frost-700 mb-3">
                            მომხმარებლები
                            <span className="text-frost-400 font-normal ml-2">({users.length})</span>
                        </h3>

                        <div className="space-y-2">
                            {/* Admin user - always first */}
                            <div className="flex items-center gap-3 px-4 py-3 bg-frost-50 rounded-xl">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ice-400 to-ice-600 flex items-center justify-center shrink-0">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 15l-2-2m0 0l2-2m-2 2h12M3 7v10a2 2 0 002 2h14" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-frost-800">admin</p>
                                    <p className="text-xs text-frost-400">ადმინისტრატორი</p>
                                </div>
                                <span className="px-2 py-1 bg-ice-100 text-ice-700 text-xs font-medium rounded-lg">
                                    ადმინი
                                </span>
                            </div>

                            {/* Other users */}
                            {nonAdminUsers.map((user) => (
                                <div key={user.username} className="flex items-center gap-3 px-4 py-3 bg-frost-50 rounded-xl group">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-frost-300 to-frost-400 flex items-center justify-center shrink-0">
                                        <span className="text-white font-bold text-sm uppercase">
                                            {user.username.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-frost-800">{user.username}</p>
                                        {editingUser === user.username ? (
                                            <div className="flex gap-1.5 mt-1">
                                                <input
                                                    ref={editRef}
                                                    value={editPassword}
                                                    onChange={(e) => setEditPassword(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handlePasswordSave(user.username);
                                                        if (e.key === 'Escape') { setEditingUser(null); setEditPassword(''); }
                                                    }}
                                                    type="password"
                                                    placeholder="ახალი პაროლი"
                                                    className="bg-white border border-frost-200 text-frost-700 text-xs rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-ice-400/50 w-28"
                                                />
                                                <button
                                                    onClick={() => handlePasswordSave(user.username)}
                                                    className="text-xs text-ice-600 hover:text-ice-700 font-medium cursor-pointer"
                                                >
                                                    შენახვა
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-frost-400">
                                                შეიქმნა: {new Date(user.createdAt).toLocaleDateString('ka-GE')}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => { setEditingUser(user.username); setEditPassword(user.password || ''); }}
                                            className="w-7 h-7 rounded-lg hover:bg-frost-200 flex items-center justify-center transition-colors cursor-pointer"
                                            title="პაროლის შეცვლა"
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.username)}
                                            className="w-7 h-7 rounded-lg hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer"
                                            title="მომხმარებლის წაშლა"
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {nonAdminUsers.length === 0 && (
                                <div className="text-center py-6 text-frost-400 text-sm">
                                    <svg className="mx-auto mb-2" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <line x1="19" y1="11" x2="19" y2="17" />
                                    </svg>
                                    ჯერ არ არის დამატებული მომხმარებლები
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
