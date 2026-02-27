import { useState, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { LABEL_COLORS } from '../data/mockData';
import { COVER_COLORS } from './Card';
import ImageLightbox from './ImageLightbox';
import DatePicker from './DatePicker';

export default function CardModal({
    card,
    listId,
    lists,
    updateCard,
    deleteCard,
    moveCardToList,
    onClose,
}) {
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description || '');
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [showLabelPicker, setShowLabelPicker] = useState(false);
    const [newCheckItem, setNewCheckItem] = useState('');
    const [isAddingCheckItem, setIsAddingCheckItem] = useState(false);
    const [showMoveMenu, setShowMoveMenu] = useState(false);
    const [showCoverPicker, setShowCoverPicker] = useState(false);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [lightboxSrc, setLightboxSrc] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const descRef = useRef(null);
    const checkInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const linkInputRef = useRef(null);

    useEffect(() => {
        if (isEditingDesc && descRef.current) {
            descRef.current.focus();
            descRef.current.setSelectionRange(descRef.current.value.length, descRef.current.value.length);
        }
    }, [isEditingDesc]);

    useEffect(() => {
        if (isAddingCheckItem && checkInputRef.current) checkInputRef.current.focus();
    }, [isAddingCheckItem]);

    useEffect(() => {
        if (showLinkInput && linkInputRef.current) linkInputRef.current.focus();
    }, [showLinkInput]);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape' && !lightboxSrc) onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose, lightboxSrc]);

    const handleTitleBlur = () => {
        if (title.trim() && title !== card.title) updateCard(card.id, { title: title.trim() });
        else setTitle(card.title);
    };

    const handleDescSave = () => {
        updateCard(card.id, { description });
        setIsEditingDesc(false);
    };

    const toggleLabel = (labelId) => {
        const current = card.labels || [];
        const newLabels = current.includes(labelId) ? current.filter((l) => l !== labelId) : [...current, labelId];
        updateCard(card.id, { labels: newLabels });
    };

    const setCover = (color) => {
        updateCard(card.id, { coverColor: card.coverColor === color ? null : color });
    };

    const addCheckItem = () => {
        if (newCheckItem.trim()) {
            const newItem = { id: nanoid(), text: newCheckItem.trim(), checked: false };
            updateCard(card.id, { checklist: [...(card.checklist || []), newItem] });
            setNewCheckItem('');
        }
    };

    const toggleCheckItem = (itemId) => {
        updateCard(card.id, { checklist: (card.checklist || []).map((item) => item.id === itemId ? { ...item, checked: !item.checked } : item) });
    };

    const deleteCheckItem = (itemId) => {
        updateCard(card.id, { checklist: (card.checklist || []).filter((item) => item.id !== itemId) });
    };

    const handleDueDateChange = (dateStr) => {
        updateCard(card.id, { dueDate: dateStr || null });
    };

    const addAttachmentByLink = () => {
        if (linkUrl.trim()) {
            const att = { id: nanoid(), type: 'link', url: linkUrl.trim(), name: linkUrl.trim().split('/').pop() || 'სურათი' };
            updateCard(card.id, { attachments: [...(card.attachments || []), att] });
            setLinkUrl('');
            setShowLinkInput(false);
        }
    };

    const handleFileUpload = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        Array.from(files).forEach((file) => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const att = { id: nanoid(), type: 'upload', url: ev.target.result, name: file.name };
                updateCard(card.id, { attachments: [...(card.attachments || []), att] });
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
        setShowAttachMenu(false);
    };

    const deleteAttachment = (attId) => {
        updateCard(card.id, { attachments: (card.attachments || []).filter((a) => a.id !== attId) });
    };

    const handleDelete = () => { deleteCard(card.id, listId); onClose(); };
    const handleMove = (targetListId) => {
        if (targetListId !== listId) moveCardToList(card.id, listId, targetListId);
        setShowMoveMenu(false);
    };

    const checklist = card.checklist || [];
    const totalItems = checklist.length;
    const checkedItems = checklist.filter((c) => c.checked).length;
    const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;
    const labels = card.labels || [];
    const attachments = card.attachments || [];
    const currentList = lists.find((l) => l.id === listId);

    return (
        <>
            <div
                className="fixed inset-0 z-[100] glass-modal-backdrop flex items-start sm:justify-center pt-0 sm:pt-12 pb-0 sm:pb-12 overflow-y-auto"
                onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            >
                <div className="glass-modal rounded-t-2xl sm:rounded-2xl w-full max-w-[720px] mx-0 sm:mx-4 shadow-2xl animate-slide-up relative mt-auto sm:mt-0" onClick={(e) => e.stopPropagation()}>
                    {/* Cover */}
                    {card.coverColor && <div className="h-24 w-full rounded-t-2xl" style={{ background: card.coverColor }} />}

                    {/* Close */}
                    <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-black/10 flex items-center justify-center transition-colors z-10 cursor-pointer">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={card.coverColor ? 'white' : '#64748b'} strokeWidth="2" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    <div className="p-4 sm:p-6 md:p-8">
                        {/* Title */}
                        <div className="flex items-start gap-3 mb-1 pr-8">
                            <svg className="mt-1 shrink-0 text-frost-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" />
                            </svg>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={handleTitleBlur}
                                onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                                className="flex-1 text-xl font-bold text-frost-800 bg-transparent outline-none focus:bg-frost-50 rounded-lg px-2 py-1 -mx-2 transition-colors" />
                        </div>
                        <div className="ml-8 mb-6">
                            <span className="text-xs text-frost-400">
                                სიაში: <span className="font-medium text-frost-500 underline decoration-dotted">{currentList?.title || 'უცნობი'}</span>
                            </span>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Main Content */}
                            <div className="flex-1 space-y-6 min-w-0 relative z-0">
                                {/* Labels */}
                                {labels.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-frost-400 uppercase tracking-wider mb-2 ml-8">სტიკერი</h4>
                                        <div className="flex flex-wrap gap-1.5 ml-8">
                                            {labels.map((lid) => LABEL_COLORS.find((lc) => lc.id === lid)).filter(Boolean).map((label) => (
                                                <span key={label.id} className="px-3 py-1 rounded-md text-xs font-medium text-white" style={{ background: label.color }}>{label.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Due Date Display */}
                                {card.dueDate && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-frost-400 uppercase tracking-wider mb-2 ml-8">ვადა</h4>
                                        <div className="ml-8">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${new Date(card.dueDate) < new Date() ? 'bg-red-100 text-red-700' : 'bg-ice-100 text-ice-700'
                                                }`}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                                {new Date(card.dueDate).toLocaleDateString('ka-GE', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Description */}
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <svg className="text-frost-400 shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" />
                                        </svg>
                                        <h4 className="text-sm font-semibold text-frost-700">აღწერა</h4>
                                    </div>
                                    <div className="ml-8">
                                        {isEditingDesc ? (
                                            <div>
                                                <textarea ref={descRef} value={description} onChange={(e) => setDescription(e.target.value)}
                                                    className="w-full bg-frost-50 border border-frost-200 text-frost-700 text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-ice-400/50 focus:border-ice-400 resize-none min-h-[120px]"
                                                    placeholder="დაამატეთ დეტალური აღწერა..." />
                                                <div className="flex gap-2 mt-2">
                                                    <button onClick={handleDescSave} className="px-4 py-1.5 bg-ice-500 hover:bg-ice-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">შენახვა</button>
                                                    <button onClick={() => { setDescription(card.description || ''); setIsEditingDesc(false); }} className="px-4 py-1.5 bg-frost-100 hover:bg-frost-200 text-frost-600 text-sm font-medium rounded-lg transition-colors cursor-pointer">გაუქმება</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div onClick={() => setIsEditingDesc(true)}
                                                className={`text-sm rounded-lg px-3 py-2.5 cursor-pointer transition-colors min-h-[60px] ${description ? 'text-frost-600 hover:bg-frost-50' : 'bg-frost-50 text-frost-400 hover:bg-frost-100'}`}>
                                                {description || 'დაამატეთ დეტალური აღწერა...'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Attachments */}
                                {attachments.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <svg className="text-frost-400 shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                            </svg>
                                            <h4 className="text-sm font-semibold text-frost-700">მიმაგრებული ფაილები</h4>
                                        </div>
                                        <div className="ml-8 grid grid-cols-3 sm:grid-cols-4 gap-2">
                                            {attachments.map((att) => (
                                                <div key={att.id} className="relative group rounded-lg overflow-hidden border border-frost-200 bg-frost-50">
                                                    <img src={att.url} alt={att.name} className="w-full h-20 object-cover cursor-pointer hover:scale-105 transition-transform"
                                                        onClick={() => setLightboxSrc(att.url)} onError={(e) => { e.target.style.display = 'none'; }} />
                                                    <button onClick={() => deleteAttachment(att.id)}
                                                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                    </button>
                                                    <div className="px-1.5 py-1"><p className="text-[10px] text-frost-500 truncate">{att.name}</p></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Checklist */}
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <svg className="text-frost-400 shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                        </svg>
                                        <h4 className="text-sm font-semibold text-frost-700">თასქლისტი</h4>
                                        {totalItems > 0 && <span className="text-xs text-frost-400 ml-auto">{checkedItems}/{totalItems}</span>}
                                    </div>
                                    {totalItems > 0 && (
                                        <div className="ml-8 mb-3">
                                            <div className="w-full bg-frost-100 rounded-full h-1.5 overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-300"
                                                    style={{ width: `${progress}%`, background: progress === 100 ? '#10b981' : 'linear-gradient(90deg, #0ea5e9, #38bdf8)' }} />
                                            </div>
                                        </div>
                                    )}
                                    <div className="ml-8 space-y-1">
                                        {checklist.map((item) => (
                                            <div key={item.id} className="flex items-center gap-2.5 group py-1 px-1 rounded-lg hover:bg-frost-50 transition-colors">
                                                <button onClick={() => toggleCheckItem(item.id)}
                                                    className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${item.checked ? 'bg-ice-500 border-ice-500' : 'border-frost-300 hover:border-ice-400'}`}>
                                                    {item.checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                                                </button>
                                                <span className={`flex-1 text-sm ${item.checked ? 'line-through text-frost-400' : 'text-frost-700'}`}>{item.text}</span>
                                                <button onClick={() => deleteCheckItem(item.id)}
                                                    className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded hover:bg-frost-200 flex items-center justify-center transition-all cursor-pointer">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="ml-8 mt-2">
                                        {isAddingCheckItem ? (
                                            <div className="animate-fade-in">
                                                <input ref={checkInputRef} value={newCheckItem} onChange={(e) => setNewCheckItem(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') addCheckItem(); if (e.key === 'Escape') { setIsAddingCheckItem(false); setNewCheckItem(''); } }}
                                                    placeholder="დაამატეთ ელემენტი" className="w-full bg-frost-50 border border-frost-200 text-frost-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-ice-400/50 focus:border-ice-400" />
                                                <div className="flex gap-2 mt-2">
                                                    <button onClick={addCheckItem} className="px-3 py-1.5 bg-ice-500 hover:bg-ice-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">დამატება</button>
                                                    <button onClick={() => { setIsAddingCheckItem(false); setNewCheckItem(''); }} className="px-3 py-1.5 bg-frost-100 hover:bg-frost-200 text-frost-600 text-sm font-medium rounded-lg transition-colors cursor-pointer">გაუქმება</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button onClick={() => setIsAddingCheckItem(true)}
                                                className="text-sm text-frost-500 hover:text-frost-700 hover:bg-frost-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">+ ელემენტის დამატება</button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Actions */}
                            <div className="lg:w-[180px] shrink-0 relative z-10">
                                <h4 className="text-xs font-semibold text-frost-400 uppercase tracking-wider mb-3">მოქმედებები</h4>
                                <div className="flex flex-row lg:flex-col gap-2 flex-wrap pb-2 lg:pb-0">

                                    {/* Labels */}
                                    <div className="relative">
                                        <button onClick={() => setShowLabelPicker(!showLabelPicker)}
                                            className="w-full flex items-center gap-2 px-3 py-2 bg-frost-100 hover:bg-frost-200 text-frost-700 text-sm font-medium rounded-lg transition-colors cursor-pointer">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
                                            </svg>
                                            სტიკერი
                                        </button>
                                        {showLabelPicker && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setShowLabelPicker(false)} />
                                                <div className="absolute left-0 lg:left-auto lg:right-0 bottom-10 lg:bottom-auto lg:top-10 bg-white rounded-xl shadow-xl border border-frost-200 p-3 z-50 min-w-[220px] animate-fade-in">
                                                    <h5 className="text-xs font-semibold text-frost-400 uppercase tracking-wider mb-2">აირჩიეთ სტიკერი</h5>
                                                    <div className="space-y-1">
                                                        {LABEL_COLORS.map((label) => (
                                                            <button key={label.id} onClick={() => toggleLabel(label.id)}
                                                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-frost-50 transition-colors cursor-pointer">
                                                                <div className="w-8 h-5 rounded" style={{ background: label.color }} />
                                                                <span className="text-sm text-frost-700 flex-1 text-left">{label.name}</span>
                                                                {labels.includes(label.id) && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Cover */}
                                    <div className="relative">
                                        <button onClick={() => setShowCoverPicker(!showCoverPicker)}
                                            className="w-full flex items-center gap-2 px-3 py-2 bg-frost-100 hover:bg-frost-200 text-frost-700 text-sm font-medium rounded-lg transition-colors cursor-pointer">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" />
                                            </svg>
                                            ქუდი
                                        </button>
                                        {showCoverPicker && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setShowCoverPicker(false)} />
                                                <div className="absolute left-0 lg:left-auto lg:right-0 bottom-10 lg:bottom-auto lg:top-10 bg-white rounded-xl shadow-xl border border-frost-200 p-3 z-50 min-w-[220px] animate-fade-in">
                                                    <h5 className="text-xs font-semibold text-frost-400 uppercase tracking-wider mb-2">აირჩიეთ ფერი</h5>
                                                    <div className="grid grid-cols-5 gap-1.5">
                                                        {COVER_COLORS.map((c) => (
                                                            <button key={c.id} onClick={() => setCover(c.color)}
                                                                className={`w-9 h-7 rounded-md cursor-pointer transition-all hover:scale-110 ${card.coverColor === c.color ? 'ring-2 ring-ice-500 ring-offset-1' : ''}`}
                                                                style={{ background: c.color }} />
                                                        ))}
                                                    </div>
                                                    {card.coverColor && (
                                                        <button onClick={() => { updateCard(card.id, { coverColor: null }); setShowCoverPicker(false); }}
                                                            className="w-full mt-2 text-xs text-frost-500 hover:text-frost-700 py-1 cursor-pointer">ქუდის მოხსნა</button>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Attachments */}
                                    <div className="relative">
                                        <button onClick={() => setShowAttachMenu(!showAttachMenu)}
                                            className="w-full flex items-center gap-2 px-3 py-2 bg-frost-100 hover:bg-frost-200 text-frost-700 text-sm font-medium rounded-lg transition-colors cursor-pointer">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                            </svg>
                                            ფოტო
                                        </button>
                                        {showAttachMenu && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => { setShowAttachMenu(false); setShowLinkInput(false); }} />
                                                <div className="absolute left-0 lg:left-auto lg:right-0 bottom-10 lg:bottom-auto lg:top-10 bg-white rounded-xl shadow-xl border border-frost-200 py-1 z-50 min-w-[200px] animate-fade-in">
                                                    <button onClick={() => { fileInputRef.current?.click(); }}
                                                        className="w-full px-3 py-2 text-left text-sm text-frost-700 hover:bg-frost-50 flex items-center gap-2 cursor-pointer transition-colors">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                                        </svg>
                                                        სურათის ატვირთვა
                                                    </button>
                                                    <button onClick={() => setShowLinkInput(true)}
                                                        className="w-full px-3 py-2 text-left text-sm text-frost-700 hover:bg-frost-50 flex items-center gap-2 cursor-pointer transition-colors">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                                        </svg>
                                                        ბმულის დამატება
                                                    </button>
                                                    {showLinkInput && (
                                                        <div className="px-3 py-2 border-t border-frost-100">
                                                            <input ref={linkInputRef} value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
                                                                onKeyDown={(e) => { if (e.key === 'Enter') addAttachmentByLink(); if (e.key === 'Escape') setShowLinkInput(false); }}
                                                                placeholder="ჩასვით სურათის ბმული..."
                                                                className="w-full bg-frost-50 border border-frost-200 text-frost-700 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-ice-400/50" />
                                                            <button onClick={addAttachmentByLink}
                                                                className="mt-1.5 w-full px-3 py-1 bg-ice-500 hover:bg-ice-600 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer">დამატება</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
                                    </div>

                                    {/* Due Date */}
                                    <div className="relative">
                                        <button onClick={() => setShowDatePicker(true)}
                                            className="w-full flex items-center gap-2 px-3 py-2 bg-frost-100 hover:bg-frost-200 text-frost-700 text-sm font-medium rounded-lg transition-colors cursor-pointer">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                            </svg>
                                            ვადა
                                        </button>
                                    </div>

                                    {/* Move */}
                                    <div className="relative">
                                        <button onClick={() => setShowMoveMenu(!showMoveMenu)}
                                            className="w-full flex items-center gap-2 px-3 py-2 bg-frost-100 hover:bg-frost-200 text-frost-700 text-sm font-medium rounded-lg transition-colors cursor-pointer">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                            </svg>
                                            გადატანა
                                        </button>
                                        {showMoveMenu && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setShowMoveMenu(false)} />
                                                <div className="absolute left-0 lg:left-auto lg:right-0 bottom-10 lg:bottom-auto lg:top-10 bg-white rounded-xl shadow-xl border border-frost-200 p-3 z-50 min-w-[200px] animate-fade-in">
                                                    <h5 className="text-xs font-semibold text-frost-400 uppercase tracking-wider mb-2">გადატანა სიაში</h5>
                                                    <div className="space-y-1">
                                                        {lists.map((l) => (
                                                            <button key={l.id} onClick={() => handleMove(l.id)}
                                                                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${l.id === listId ? 'bg-ice-50 text-ice-600 font-medium' : 'text-frost-700 hover:bg-frost-50'}`}>
                                                                {l.title}{l.id === listId && <span className="text-xs text-frost-400 ml-1">(მიმდინარე)</span>}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="border-t border-frost-200 my-3 hidden lg:block" />

                                    {/* Delete */}
                                    <button onClick={handleDelete}
                                        className="w-full lg:w-auto flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        </svg>
                                        ბარათის წაშლა
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {lightboxSrc && <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
            {showDatePicker && <DatePicker value={card.dueDate || ''} onChange={handleDueDateChange} onClose={() => setShowDatePicker(false)} />}
        </>
    );
}
