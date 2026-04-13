import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Card from './Card';

export default function List({
    list,
    cards,
    addCard,
    updateListTitle,
    deleteList,
    openCard,
    isDraggingCard,
}) {
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitle, setEditTitle] = useState(list.title);
    const [showMenu, setShowMenu] = useState(false);
    const addInputRef = useRef(null);
    const titleInputRef = useRef(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: list.id,
        data: { type: 'list', list },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    useEffect(() => {
        if (isAddingCard && addInputRef.current) {
            addInputRef.current.focus();
        }
    }, [isAddingCard]);

    useEffect(() => {
        if (isEditingTitle && titleInputRef.current) {
            titleInputRef.current.focus();
            titleInputRef.current.select();
        }
    }, [isEditingTitle]);

    const handleAddCard = () => {
        if (newCardTitle.trim()) {
            addCard(list.id, newCardTitle.trim());
            setNewCardTitle('');
        }
    };

    const addContainerRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (isAddingCard && addContainerRef.current && !addContainerRef.current.contains(event.target)) {
                if (!newCardTitle.trim()) {
                    setIsAddingCard(false);
                    setNewCardTitle('');
                } else {
                    handleAddCard();
                }
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isAddingCard, newCardTitle, addCard, list.id]);

    const handleTitleSave = () => {
        if (editTitle.trim() && editTitle.trim() !== list.title) {
            updateListTitle(list.id, editTitle.trim());
        } else {
            setEditTitle(list.title);
        }
        setIsEditingTitle(false);
    };

    const cardIds = cards.map((c) => c.id);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="w-[72vw] sm:w-[300px] min-w-[72vw] sm:min-w-[300px] flex flex-col max-h-full"
        >
            <div className="glass-list rounded-xl flex flex-col max-h-full">
                {/* List Header */}
                <div
                    className="flex items-center justify-between px-3 pt-3 pb-1 cursor-grab"
                    {...attributes}
                    {...listeners}
                >
                    {isEditingTitle ? (
                        <input
                            ref={titleInputRef}
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={handleTitleSave}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleTitleSave();
                                if (e.key === 'Escape') {
                                    setEditTitle(list.title);
                                    setIsEditingTitle(false);
                                }
                            }}
                            className="flex-1 bg-white/30 text-white font-semibold text-sm px-2 py-1 rounded-lg outline-none focus:ring-2 focus:ring-white/40"
                            onClick={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <h3
                            className="flex-1 font-semibold text-white text-sm px-1 py-1 cursor-text rounded hover:bg-white/10 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditingTitle(true);
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            {list.title}
                            <span className="ml-2 text-white/50 font-normal text-xs">
                                {cards.length}
                            </span>
                        </h3>
                    )}

                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="w-7 h-7 rounded-md hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                                <circle cx="12" cy="5" r="1.5" fill="white" />
                                <circle cx="12" cy="12" r="1.5" fill="white" />
                                <circle cx="12" cy="19" r="1.5" fill="white" />
                            </svg>
                        </button>

                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowMenu(false)}
                                />
                                <div className="absolute right-0 top-9 bg-white rounded-xl shadow-xl border border-frost-200 py-1 z-50 min-w-[160px] animate-fade-in">
                                    <button
                                        onClick={() => {
                                            deleteList(list.id);
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18" />
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        </svg>
                                        სიის წაშლა
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-1 min-h-[8px]">
                    <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2 py-1">
                            {cards.map((card) => (
                                <Card
                                    key={card.id}
                                    card={card}
                                    listId={list.id}
                                    onClick={() => openCard(card.id, list.id)}
                                />
                            ))}
                        </div>
                    </SortableContext>

                    {cards.length === 0 && isDraggingCard && (
                        <div className="h-20 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center mx-1 my-1">
                            <span className="text-white/40 text-xs">ჩააგდეთ აქ</span>
                        </div>
                    )}
                </div>

                {/* Add Card */}
                <div className="px-2 pb-2">
                    {isAddingCard ? (
                        <div ref={addContainerRef} className="animate-fade-in">
                            <textarea
                                ref={addInputRef}
                                value={newCardTitle}
                                onChange={(e) => setNewCardTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAddCard();
                                    }
                                    if (e.key === 'Escape') {
                                        setIsAddingCard(false);
                                        setNewCardTitle('');
                                    }
                                }}
                                placeholder="შეიყვანეთ ბარათის სათაური..."
                                className="w-full bg-white/90 text-frost-800 text-sm rounded-lg px-3 py-2 resize-none outline-none focus:ring-2 focus:ring-ice-400/50 shadow-sm placeholder:text-frost-400"
                                rows={2}
                            />
                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    onClick={handleAddCard}
                                    className="px-3 py-1.5 bg-ice-500 hover:bg-ice-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                                >
                                    დამატება
                                </button>
                                <button
                                    onClick={() => {
                                        setIsAddingCard(false);
                                        setNewCardTitle('');
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
                    ) : (
                        <button
                            onClick={() => setIsAddingCard(true)}
                            className="w-full text-left px-2 py-2 text-white/70 hover:text-white hover:bg-white/10 text-sm rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            ბარათის დამატება
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
