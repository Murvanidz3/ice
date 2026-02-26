import { useEffect } from 'react';

export default function ImageLightbox({ src, alt, onClose }) {
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer z-10"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
            <img
                src={src}
                alt={alt || 'Attachment'}
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}
