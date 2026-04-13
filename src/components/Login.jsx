import { useState, useRef, useEffect } from 'react';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isShaking, setIsShaking] = useState(false);
    const inputRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const ok = await onLogin(username, password);
        setIsLoading(false);
        if (!ok) {
            setError('მომხმარებლის სახელი ან პაროლი არასწორია / რექვესტის შეცდომა');
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#38bdf8] p-4">
            {/* Floating ice particles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute w-64 h-64 rounded-full bg-white/5 blur-3xl top-[10%] left-[15%] animate-pulse" />
                <div className="absolute w-96 h-96 rounded-full bg-cyan-300/5 blur-3xl bottom-[10%] right-[10%] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute w-48 h-48 rounded-full bg-blue-200/5 blur-3xl top-[50%] left-[60%] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div
                className={`glass-modal rounded-2xl w-full max-w-[420px] p-8 shadow-2xl animate-slide-up relative z-10 ${isShaking ? 'animate-shake' : ''
                    }`}
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ice-400 to-ice-600 flex items-center justify-center mb-4 shadow-lg">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="2" x2="12" y2="22" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                            <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
                            <circle cx="12" cy="12" r="3" fill="white" fillOpacity="0.3" />
                            <line x1="12" y1="2" x2="14" y2="5" />
                            <line x1="12" y1="2" x2="10" y2="5" />
                            <line x1="12" y1="22" x2="14" y2="19" />
                            <line x1="12" y1="22" x2="10" y2="19" />
                            <line x1="2" y1="12" x2="5" y2="10" />
                            <line x1="2" y1="12" x2="5" y2="14" />
                            <line x1="22" y1="12" x2="19" y2="10" />
                            <line x1="22" y1="12" x2="19" y2="14" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-frost-800 tracking-tight">WINTRIX</h1>
                    <p className="text-frost-400 text-sm mt-1">შედით თქვენს სამუშაო სივრცეში</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-frost-600 mb-1.5">
                            მომხმარებელი
                        </label>
                        <input
                            ref={inputRef}
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-frost-50 border border-frost-200 text-frost-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ice-400/50 focus:border-ice-400 transition-all placeholder:text-frost-300"
                            placeholder="შეიყვანეთ მომხმარებლის სახელი"
                            autoComplete="username"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-frost-600 mb-1.5">
                            პაროლი
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-frost-50 border border-frost-200 text-frost-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ice-400/50 focus:border-ice-400 transition-all placeholder:text-frost-300"
                            placeholder="შეიყვანეთ პაროლი"
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2 animate-fade-in flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-ice-500 to-ice-600 hover:from-ice-600 hover:to-ice-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-ice-500/25 hover:shadow-ice-500/40 cursor-pointer text-sm disabled:opacity-75 disabled:cursor-wait flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>მოწმდება ჩანაწერები...</span>
                            </>
                        ) : (
                            'შესვლა'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
