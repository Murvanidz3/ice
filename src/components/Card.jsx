import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LABEL_COLORS } from '../data/mockData';

const COVER_COLORS = [
    { id: 'cover-red', color: '#ef4444' },
    { id: 'cover-orange', color: '#f97316' },
    { id: 'cover-amber', color: '#f59e0b' },
    { id: 'cover-emerald', color: '#10b981' },
    { id: 'cover-cyan', color: '#06b6d4' },
    { id: 'cover-blue', color: '#3b82f6' },
    { id: 'cover-violet', color: '#8b5cf6' },
    { id: 'cover-pink', color: '#ec4899' },
    { id: 'cover-rose', color: '#f43f5e' },
    { id: 'cover-teal', color: '#14b8a6' },
];

export { COVER_COLORS };

export default function Card({ card, listId, onClick, isOverlay }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
        data: { type: 'card', card, listId },
        disabled: isOverlay,
    });

    const style = isOverlay
        ? {}
        : {
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.3 : 1,
        };

    const labels = (card.labels || [])
        .map((lid) => LABEL_COLORS.find((lc) => lc.id === lid))
        .filter(Boolean);

    const checklist = card.checklist || [];
    const totalItems = checklist.length;
    const checkedItems = checklist.filter((c) => c.checked).length;
    const allDone = totalItems > 0 && checkedItems === totalItems;

    const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();
    const attachments = card.attachments || [];

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('ka-GE', { month: 'short', day: 'numeric' });
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className={`glass-card rounded-lg overflow-hidden cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all duration-150 group ${isDragging ? 'shadow-lg ring-2 ring-ice-400/40' : ''
                }`}
        >
            {/* Cover Color */}
            {card.coverColor && (
                <div
                    className="h-8 w-full"
                    style={{ background: card.coverColor }}
                />
            )}

            <div className="px-3 py-2.5">
                {/* Labels */}
                {labels.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {labels.map((label) => (
                            <span
                                key={label.id}
                                className="h-2 w-10 rounded-full"
                                style={{ background: label.color }}
                                title={label.name}
                            />
                        ))}
                    </div>
                )}

                {/* Title */}
                <p className="text-sm text-frost-800 font-medium leading-snug">{card.title}</p>

                {/* Badges */}
                {(card.dueDate || totalItems > 0 || card.description || attachments.length > 0) && (
                    <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                        {/* Due Date */}
                        {card.dueDate && (
                            <span
                                className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${allDone
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : isOverdue
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-frost-100 text-frost-500'
                                    }`}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                {formatDate(card.dueDate)}
                            </span>
                        )}

                        {/* Description indicator */}
                        {card.description && (
                            <span className="text-frost-400" title="აღწერა">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="17" y1="10" x2="3" y2="10" />
                                    <line x1="21" y1="6" x2="3" y2="6" />
                                    <line x1="21" y1="14" x2="3" y2="14" />
                                    <line x1="17" y1="18" x2="3" y2="18" />
                                </svg>
                            </span>
                        )}

                        {/* Checklist progress */}
                        {totalItems > 0 && (
                            <span
                                className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${allDone
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-frost-100 text-frost-500'
                                    }`}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 11 12 14 22 4" />
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                </svg>
                                {checkedItems}/{totalItems}
                            </span>
                        )}

                        {/* Attachments count */}
                        {attachments.length > 0 && (
                            <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-frost-100 text-frost-500">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                </svg>
                                {attachments.length}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
