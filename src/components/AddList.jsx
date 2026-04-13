import { useState, useRef, useEffect } from 'react';

export default function AddList({ onAdd }) {
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (isAdding && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isAdding]);

    const handleAdd = () => {
        if (title.trim()) {
            onAdd(title.trim());
            setTitle('');
            setIsAdding(false);
        }
    };

    const addContainerRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (isAdding && addContainerRef.current && !addContainerRef.current.contains(event.target)) {
                if (!title.trim()) {
                    setIsAdding(false);
                    setTitle('');
                } else {
                    handleAdd();
                }
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isAdding, title, onAdd]);

    if (!isAdding) {
        return (
            <button
                onClick={() => setIsAdding(true)}
                className="w-[72vw] sm:w-[300px] min-w-[72vw] sm:min-w-[300px] p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-medium transition-all flex items-center gap-2 cursor-pointer border border-white/10 hover:border-white/20"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                სიის დამატება
            </button>
        );
    }

    return (
        <div ref={addContainerRef} className="w-[72vw] sm:w-[300px] min-w-[72vw] sm:min-w-[300px] glass-list rounded-xl p-3 animate-fade-in">
            <input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAdd();
                    if (e.key === 'Escape') {
                        setIsAdding(false);
                        setTitle('');
                    }
                }}
                placeholder="სიის სათაური..."
                className="w-full bg-white/30 text-white placeholder:text-white/50 text-sm px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-white/40"
            />
            <div className="flex items-center gap-2 mt-2">
                <button
                    onClick={handleAdd}
                    className="px-4 py-1.5 bg-ice-500 hover:bg-ice-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                    დამატება
                </button>
                <button
                    onClick={() => {
                        setIsAdding(false);
                        setTitle('');
                    }}
                    className="w-7 h-7 rounded-md hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
