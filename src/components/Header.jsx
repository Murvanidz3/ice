import { useState, useRef, useEffect } from 'react';

const GRADIENT_PRESETS = [
    { id: 'ice', name: 'ყინული', gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 25%, #0ea5e9 50%, #38bdf8 75%, #7dd3fc 100%)' },
    { id: 'ocean', name: 'ოკეანე', gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 25%, #047857 50%, #059669 75%, #34d399 100%)' },
    { id: 'sunset', name: 'მზის ჩასვლა', gradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 25%, #ea580c 50%, #f97316 75%, #fdba74 100%)' },
    { id: 'purple', name: 'იისფერი', gradient: 'linear-gradient(135deg, #3b0764 0%, #6b21a8 25%, #7c3aed 50%, #8b5cf6 75%, #c4b5fd 100%)' },
    { id: 'rose', name: 'ვარდი', gradient: 'linear-gradient(135deg, #881337 0%, #be123c 25%, #e11d48 50%, #f43f5e 75%, #fda4af 100%)' },
    { id: 'midnight', name: 'შუაღამე', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)' },
    { id: 'forest', name: 'ტყე', gradient: 'linear-gradient(135deg, #14532d 0%, #166534 25%, #15803d 50%, #22c55e 75%, #86efac 100%)' },
    { id: 'aurora', name: 'აურორა', gradient: 'linear-gradient(135deg, #0c4a6e 0%, #7c3aed 30%, #c026d3 50%, #f43f5e 70%, #f97316 100%)' },
    { id: 'gold', name: 'ოქრო', gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 25%, #b45309 50%, #d97706 75%, #fbbf24 100%)' },
    { id: 'steel', name: 'ფოლადი', gradient: 'linear-gradient(135deg, #18181b 0%, #27272a 25%, #3f3f46 50%, #52525b 75%, #71717a 100%)' },
    { id: 'sakura', name: 'საკურა', gradient: 'linear-gradient(135deg, #831843 0%, #be185d 25%, #ec4899 50%, #f9a8d4 75%, #fce7f3 100%)' },
    { id: 'tropical', name: 'ტროპიკული', gradient: 'linear-gradient(135deg, #065f46 0%, #0d9488 25%, #06b6d4 50%, #38bdf8 75%, #a5f3fc 100%)' },
];

function getGradientKey(username) {
    return `ice-gradient-${username || 'default'}`;
}

function applyGradient(gradient) {
    const root = document.getElementById('root');
    if (root) root.style.setProperty('--bg-gradient', gradient);
}

export default function Header({ activeProject, currentUser, isAdmin, resetBoard, logout, verifyPassword, changeOwnPassword, sidebarCollapsed, setSidebarCollapsed, onOpenUserManager, bgGradient, updateBackground }) {
    const [showMenu, setShowMenu] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [resetPassword, setResetPassword] = useState('');
    const [resetError, setResetError] = useState('');
    const resetInputRef = useRef(null);

    // Change password state
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [cpError, setCpError] = useState('');
    const [cpSuccess, setCpSuccess] = useState('');
    const oldPassRef = useRef(null);

    // Gradient picker state
    const [showGradientPicker, setShowGradientPicker] = useState(false);

    // Apply gradient whenever bgGradient prop changes
    useEffect(() => {
        applyGradient(bgGradient);
    }, [bgGradient]);

    const selectGradient = (gradient) => {
        applyGradient(gradient);
        if (updateBackground) {
            updateBackground(gradient);
        }
    };

    useEffect(() => {
        if (showResetConfirm && resetInputRef.current) resetInputRef.current.focus();
    }, [showResetConfirm]);

    useEffect(() => {
        if (showChangePassword && oldPassRef.current) oldPassRef.current.focus();
    }, [showChangePassword]);

    const handleResetConfirm = () => {
        if (verifyPassword(resetPassword)) {
            resetBoard();
            setShowResetConfirm(false);
            setResetPassword('');
            setResetError('');
        } else {
            setResetError('პაროლი არასწორია');
        }
    };

    const handleChangePassword = async () => {
        setCpError('');
        setCpSuccess('');
        if (!oldPass) { setCpError('შეიყვანეთ მიმდინარე პაროლი'); return; }
        if (newPass.length < 3) { setCpError('ახალი პაროლი მინიმუმ 3 სიმბოლო'); return; }
        if (newPass !== confirmPass) { setCpError('პაროლები არ ემთხვევა'); return; }
        const ok = await changeOwnPassword(newPass, oldPass);
        if (ok) {
            setCpSuccess('პაროლი წარმატებით შეიცვალა');
            setOldPass(''); setNewPass(''); setConfirmPass('');
            setTimeout(() => { setShowChangePassword(false); setCpSuccess(''); }, 1500);
        } else {
            setCpError('მიმდინარე პაროლი არასწორია ან შეცდომა მოხდა');
        }
    };

    const closeChangePassword = () => {
        setShowChangePassword(false);
        setOldPass(''); setNewPass(''); setConfirmPass('');
        setCpError(''); setCpSuccess('');
    };

    return (
        <>
            <header className="glass-header px-4 py-3 flex items-center justify-between relative z-50 shrink-0">
                <div className="flex items-center gap-3">
                    {sidebarCollapsed && (
                        <button onClick={() => setSidebarCollapsed(false)} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer" title="მენიუს ჩვენება">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                        </button>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="2" x2="12" y2="22" /><line x1="2" y1="12" x2="22" y2="12" />
                                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /><line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
                                <circle cx="12" cy="12" r="3" fill="white" fillOpacity="0.3" />
                                <line x1="12" y1="2" x2="14" y2="5" /><line x1="12" y1="2" x2="10" y2="5" />
                                <line x1="12" y1="22" x2="14" y2="19" /><line x1="12" y1="22" x2="10" y2="19" />
                                <line x1="2" y1="12" x2="5" y2="10" /><line x1="2" y1="12" x2="5" y2="14" />
                                <line x1="22" y1="12" x2="19" y2="10" /><line x1="22" y1="12" x2="19" y2="14" />
                            </svg>
                        </div>
                        <h1 className="text-white font-bold text-xl tracking-tight leading-none">ჭრელო</h1>
                    </div>
                    {activeProject && (
                        <>
                            <span className="text-white/30 text-lg">/</span>
                            <span className="text-white/80 text-sm font-medium">{activeProject.name}</span>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {currentUser && (
                        <div className="flex items-center gap-2 mr-1">
                            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                                <span className="text-white font-semibold text-xs uppercase">{currentUser.username.charAt(0)}</span>
                            </div>
                            <span className="text-white/60 text-sm hidden sm:block">{currentUser.username}</span>
                        </div>
                    )}

                    <div className="relative">
                        <button onClick={() => setShowMenu(!showMenu)} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer" title="მენიუ">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                                <circle cx="12" cy="5" r="1" fill="white" /><circle cx="12" cy="12" r="1" fill="white" /><circle cx="12" cy="19" r="1" fill="white" />
                            </svg>
                        </button>

                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                                <div className="absolute right-0 top-11 bg-white rounded-xl shadow-xl border border-frost-200 py-1 z-50 min-w-[220px] animate-fade-in">
                                    {isAdmin && (
                                        <button onClick={() => { onOpenUserManager(); setShowMenu(false); }} className="w-full px-4 py-2.5 text-left text-sm text-frost-700 hover:bg-frost-50 flex items-center gap-2 transition-colors cursor-pointer">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                            </svg>
                                            მომხმარებლები
                                        </button>
                                    )}

                                    <button onClick={() => { setShowMenu(false); setShowChangePassword(true); }} className="w-full px-4 py-2.5 text-left text-sm text-frost-700 hover:bg-frost-50 flex items-center gap-2 transition-colors cursor-pointer">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                        პაროლის შეცვლა
                                    </button>

                                    <button onClick={() => { setShowMenu(false); setShowGradientPicker(true); }} className="w-full px-4 py-2.5 text-left text-sm text-frost-700 hover:bg-frost-50 flex items-center gap-2 transition-colors cursor-pointer">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="13.5" cy="6.5" r="2.5" />
                                            <circle cx="17.5" cy="10.5" r="2.5" />
                                            <circle cx="8.5" cy="7.5" r="2.5" />
                                            <circle cx="6.5" cy="12.5" r="2.5" />
                                            <path d="M12 22c-4.97 0-9-2.24-9-5v-.09c.01-.01 2.02-3.27 3.7-5.56A15.1 15.1 0 0 1 12 6c2.12 0 4.07.85 5.3 2.35 1.68 2.29 3.69 5.55 3.7 5.56V19c0 2.76-4.03 5-9 5z" />
                                        </svg>
                                        ფონის ფერი
                                    </button>

                                    <div className="h-px bg-frost-100 my-1" />

                                    <button onClick={() => { setShowMenu(false); setShowResetConfirm(true); setResetPassword(''); setResetError(''); }} className="w-full px-4 py-2.5 text-left text-sm text-frost-700 hover:bg-frost-50 flex items-center gap-2 transition-colors cursor-pointer">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        </svg>
                                        დაფის გასუფთავება
                                    </button>

                                    <button onClick={() => { logout(); setShowMenu(false); }} className="w-full px-4 py-2.5 text-left text-sm text-frost-700 hover:bg-frost-50 flex items-center gap-2 transition-colors cursor-pointer">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                                        </svg>
                                        გამოსვლა
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Gradient Picker Modal */}
            {showGradientPicker && (
                <div
                    className="fixed inset-0 z-[100] glass-modal-backdrop flex items-center justify-center"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowGradientPicker(false); }}
                >
                    <div className="glass-modal rounded-2xl w-full max-w-[480px] mx-4 shadow-2xl animate-slide-up p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ice-400 to-violet-500 flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="13.5" cy="6.5" r="2.5" />
                                        <circle cx="17.5" cy="10.5" r="2.5" />
                                        <circle cx="8.5" cy="7.5" r="2.5" />
                                        <circle cx="6.5" cy="12.5" r="2.5" />
                                        <path d="M12 22c-4.97 0-9-2.24-9-5v-.09c.01-.01 2.02-3.27 3.7-5.56A15.1 15.1 0 0 1 12 6c2.12 0 4.07.85 5.3 2.35 1.68 2.29 3.69 5.55 3.7 5.56V19c0 2.76-4.03 5-9 5z" />
                                    </svg>
                                </div>
                                <h3 className="text-frost-800 font-bold text-base">ფონის ფერი</h3>
                            </div>
                            <button onClick={() => setShowGradientPicker(false)} className="w-8 h-8 rounded-lg hover:bg-frost-100 flex items-center justify-center transition-colors cursor-pointer">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {GRADIENT_PRESETS.map((preset) => (
                                <button
                                    key={preset.id}
                                    onClick={() => selectGradient(preset.gradient)}
                                    className={`relative rounded-xl h-20 overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg group ${bgGradient === preset.gradient
                                        ? 'ring-3 ring-white ring-offset-2 ring-offset-frost-100 shadow-lg scale-105'
                                        : 'ring-1 ring-frost-200'
                                        }`}
                                    style={{ background: preset.gradient }}
                                >
                                    <div className="absolute inset-0 flex items-end justify-center pb-2">
                                        <span className="text-white text-xs font-semibold drop-shadow-md px-2 py-0.5 rounded-md bg-black/20 backdrop-blur-sm">
                                            {preset.name}
                                        </span>
                                    </div>
                                    {bgGradient === preset.gradient && (
                                        <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showChangePassword && (
                <div className="fixed inset-0 z-[100] glass-modal-backdrop flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) closeChangePassword(); }}>
                    <div className="glass-modal rounded-2xl w-full max-w-[400px] mx-4 shadow-2xl animate-slide-up p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-ice-100 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                            </div>
                            <h3 className="text-frost-800 font-bold text-base">პაროლის შეცვლა</h3>
                        </div>
                        <div className="space-y-3">
                            <input ref={oldPassRef} type="password" value={oldPass} onChange={(e) => { setOldPass(e.target.value); setCpError(''); }} placeholder="მიმდინარე პაროლი" className="w-full bg-frost-50 border border-frost-200 text-frost-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ice-400/50 focus:border-ice-400 transition-all placeholder:text-frost-300" />
                            <input type="password" value={newPass} onChange={(e) => { setNewPass(e.target.value); setCpError(''); }} placeholder="ახალი პაროლი" className="w-full bg-frost-50 border border-frost-200 text-frost-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ice-400/50 focus:border-ice-400 transition-all placeholder:text-frost-300" />
                            <input type="password" value={confirmPass} onChange={(e) => { setConfirmPass(e.target.value); setCpError(''); }} onKeyDown={(e) => { if (e.key === 'Enter') handleChangePassword(); if (e.key === 'Escape') closeChangePassword(); }} placeholder="გაიმეორეთ ახალი პაროლი" className="w-full bg-frost-50 border border-frost-200 text-frost-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ice-400/50 focus:border-ice-400 transition-all placeholder:text-frost-300" />
                        </div>
                        {cpError && (<div className="mt-3 text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2 animate-fade-in flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>{cpError}</div>)}
                        {cpSuccess && (<div className="mt-3 text-emerald-600 text-sm bg-emerald-50 rounded-lg px-3 py-2 animate-fade-in flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>{cpSuccess}</div>)}
                        <div className="flex gap-2 mt-4">
                            <button onClick={handleChangePassword} className="flex-1 px-4 py-2.5 bg-ice-500 hover:bg-ice-600 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer">შეცვლა</button>
                            <button onClick={closeChangePassword} className="flex-1 px-4 py-2.5 bg-frost-100 hover:bg-frost-200 text-frost-600 text-sm font-semibold rounded-xl transition-colors cursor-pointer">გაუქმება</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className="fixed inset-0 z-[100] glass-modal-backdrop flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) { setShowResetConfirm(false); setResetPassword(''); setResetError(''); } }}>
                    <div className="glass-modal rounded-2xl w-full max-w-[400px] mx-4 shadow-2xl animate-slide-up p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            </div>
                            <div>
                                <h3 className="text-frost-800 font-bold text-base">დაფის გასუფთავება</h3>
                                <p className="text-frost-400 text-xs">ყველა პროექტი და ბარათი წაიშლება</p>
                            </div>
                        </div>
                        <p className="text-frost-600 text-sm mb-4">დადასტურებისთვის შეიყვანეთ თქვენი პაროლი:</p>
                        <input ref={resetInputRef} type="password" value={resetPassword} onChange={(e) => { setResetPassword(e.target.value); setResetError(''); }} onKeyDown={(e) => { if (e.key === 'Enter') handleResetConfirm(); if (e.key === 'Escape') { setShowResetConfirm(false); setResetPassword(''); setResetError(''); } }} placeholder="პაროლი" className="w-full bg-frost-50 border border-frost-200 text-frost-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 transition-all placeholder:text-frost-300" />
                        {resetError && (<div className="mt-2 text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2 animate-fade-in flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>{resetError}</div>)}
                        <div className="flex gap-2 mt-4">
                            <button onClick={handleResetConfirm} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer">გასუფთავება</button>
                            <button onClick={() => { setShowResetConfirm(false); setResetPassword(''); setResetError(''); }} className="flex-1 px-4 py-2.5 bg-frost-100 hover:bg-frost-200 text-frost-600 text-sm font-semibold rounded-xl transition-colors cursor-pointer">გაუქმება</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
