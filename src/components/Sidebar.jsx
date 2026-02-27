import { useState, useRef, useEffect } from 'react';

export default function Sidebar({
    projects,
    activeProjectId,
    switchProject,
    addProject,
    deleteProject,
    renameProject,
    collapsed,
    setCollapsed,
}) {
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [contextMenu, setContextMenu] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null); // project id to confirm delete
    const addInputRef = useRef(null);
    const editInputRef = useRef(null);

    useEffect(() => {
        if (isAdding && addInputRef.current) addInputRef.current.focus();
    }, [isAdding]);

    useEffect(() => {
        if (editingId && editInputRef.current) {
            editInputRef.current.focus();
            editInputRef.current.select();
        }
    }, [editingId]);

    const handleAdd = () => {
        if (newName.trim()) {
            addProject(newName.trim());
            setNewName('');
            setIsAdding(false);
        }
    };

    const handleRename = (id) => {
        if (editName.trim()) {
            renameProject(id, editName.trim());
        }
        setEditingId(null);
        setEditName('');
    };

    const handleDeleteConfirm = () => {
        if (deleteConfirm) {
            deleteProject(deleteConfirm);
            setDeleteConfirm(null);
        }
    };

    const projectColors = [
        'bg-ice-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500',
        'bg-rose-500', 'bg-cyan-500', 'bg-orange-500', 'bg-pink-500',
    ];

    const deleteProjectName = deleteConfirm ? projects.find(p => p.id === deleteConfirm)?.name : '';

    return (
        <>
            {/* Mobile overlay */}
            {!collapsed && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 lg:hidden"
                    onClick={() => setCollapsed(true)}
                />
            )}

            <aside
                className={`fixed lg:relative z-40 h-full flex flex-col transition-all duration-300 ease-in-out ${collapsed ? 'w-0 lg:w-0 overflow-hidden' : 'w-[260px]'
                    }`}
            >
                <div className="h-full flex flex-col bg-frost-900/80 backdrop-blur-xl border-r border-white/10 min-w-[260px]">
                    {/* Sidebar Header */}
                    <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-white/10">
                        <h2 className="text-white/80 text-xs font-semibold uppercase tracking-widest">
                            პროექტები
                        </h2>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsAdding(true)}
                                className="w-7 h-7 rounded-md bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer"
                                title="ახალი პროექტი"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setCollapsed(true)}
                                className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                                title="მენიუს დამალვა"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round">
                                    <polyline points="11 17 6 12 11 7" />
                                    <polyline points="18 17 13 12 18 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Project List */}
                    <div className="flex-1 overflow-y-auto py-2 px-2">
                        {/* Add Project Input */}
                        {isAdding && (
                            <div className="animate-fade-in mb-2 px-1">
                                <input
                                    ref={addInputRef}
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAdd();
                                        if (e.key === 'Escape') { setIsAdding(false); setNewName(''); }
                                    }}
                                    placeholder="პროექტის სახელი..."
                                    className="w-full bg-white/10 text-white placeholder:text-white/40 text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:ring-ice-400/50"
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={handleAdd}
                                        className="px-3 py-1.5 bg-ice-500 hover:bg-ice-600 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                                    >
                                        დამატება
                                    </button>
                                    <button
                                        onClick={() => { setIsAdding(false); setNewName(''); }}
                                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/70 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                                    >
                                        გაუქმება
                                    </button>
                                </div>
                            </div>
                        )}
                        {projects.map((proj, idx) => (
                            <div key={proj.id} className="relative group">
                                {editingId === proj.id ? (
                                    <input
                                        ref={editInputRef}
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onBlur={() => handleRename(proj.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleRename(proj.id);
                                            if (e.key === 'Escape') { setEditingId(null); setEditName(''); }
                                        }}
                                        className="w-full bg-white/10 text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:ring-ice-400/50 mb-0.5"
                                    />
                                ) : (
                                    <button
                                        onClick={() => switchProject(proj.id)}
                                        className={`w-full text-left rounded-lg px-3 py-2.5 text-sm flex items-center gap-2.5 transition-all cursor-pointer mb-0.5 ${proj.id === activeProjectId
                                            ? 'bg-white/15 text-white font-medium shadow-sm'
                                            : 'text-white/60 hover:bg-white/8 hover:text-white/90'
                                            }`}
                                    >
                                        <span
                                            className={`w-2.5 h-2.5 rounded-sm shrink-0 ${projectColors[idx % projectColors.length]
                                                }`}
                                        />
                                        <span className="truncate flex-1">{proj.name}</span>

                                        {/* Context menu trigger */}
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setContextMenu(contextMenu === proj.id ? null : proj.id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded hover:bg-white/20 flex items-center justify-center transition-opacity shrink-0"
                                        >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <circle cx="12" cy="6" r="1.5" fill="currentColor" />
                                                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                                                <circle cx="12" cy="18" r="1.5" fill="currentColor" />
                                            </svg>
                                        </span>
                                    </button>
                                )}

                                {/* Context menu */}
                                {contextMenu === proj.id && (
                                    <>
                                        <div className="fixed inset-0 z-50" onClick={() => setContextMenu(null)} />
                                        <div className="absolute right-2 top-10 bg-white rounded-xl shadow-xl border border-frost-200 py-1 z-50 min-w-[140px] animate-fade-in">
                                            <button
                                                onClick={() => {
                                                    setEditingId(proj.id);
                                                    setEditName(proj.name);
                                                    setContextMenu(null);
                                                }}
                                                className="w-full px-3 py-2 text-left text-sm text-frost-700 hover:bg-frost-50 cursor-pointer transition-colors"
                                            >
                                                სახელის შეცვლა
                                            </button>
                                            {projects.length > 1 && (
                                                <button
                                                    onClick={() => {
                                                        setDeleteConfirm(proj.id);
                                                        setContextMenu(null);
                                                    }}
                                                    className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                                                >
                                                    წაშლა
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>


                </div>
            </aside>

            {/* Delete Confirmation Popup */}
            {deleteConfirm && (
                <div
                    className="fixed inset-0 z-[100] glass-modal-backdrop flex items-center justify-center"
                    onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}
                >
                    <div className="glass-modal rounded-2xl w-full max-w-[360px] mx-4 shadow-2xl animate-slide-up p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-frost-800 font-bold text-base">ნამდვილად გსურთ წაშლა?</h3>
                                <p className="text-frost-400 text-xs mt-0.5">„{deleteProjectName}"</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleDeleteConfirm}
                                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                            >
                                კი
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-2.5 bg-frost-100 hover:bg-frost-200 text-frost-600 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                            >
                                არა
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
