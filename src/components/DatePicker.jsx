import { useState, useRef, useEffect, useCallback } from 'react';

const MONTH_NAMES = [
    'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
    'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'
];
const DAY_NAMES = ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვი'];

function getCalendarDays(year, month) {
    const firstDay = new Date(year, month, 1);
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const days = [];
    for (let i = startDay - 1; i >= 0; i--) days.push({ day: daysInPrev - i, current: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, current: true });
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push({ day: i, current: false });
    return days;
}

export default function DatePicker({ value, onChange, onClose }) {
    const today = new Date();
    const selected = value ? new Date(value + 'T00:00:00') : null;
    const [viewYear, setViewYear] = useState(selected ? selected.getFullYear() : today.getFullYear());
    const [viewMonth, setViewMonth] = useState(selected ? selected.getMonth() : today.getMonth());
    const containerRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) onClose();
        };
        document.addEventListener('mousedown', handler);
        document.addEventListener('touchstart', handler);
        return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('touchstart', handler); };
    }, [onClose]);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const prevMonth = useCallback(() => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    }, [viewMonth]);

    const nextMonth = useCallback(() => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    }, [viewMonth]);

    const selectDay = (day, isCurrent) => {
        if (!isCurrent) return;
        const m = String(viewMonth + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        onChange(`${viewYear}-${m}-${d}`);
        onClose();
    };

    const clearDate = () => { onChange(null); onClose(); };

    const days = getCalendarDays(viewYear, viewMonth);
    const isToday = (day, isCurrent) => isCurrent && day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
    const isSelected = (day, isCurrent) => selected && isCurrent && day === selected.getDate() && viewMonth === selected.getMonth() && viewYear === selected.getFullYear();

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div ref={containerRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-[320px] overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-3 flex items-center justify-between">
                    <button onClick={prevMonth} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <div className="text-white text-center">
                        <div className="text-sm font-bold">{MONTH_NAMES[viewMonth]}</div>
                        <div className="text-xs opacity-80">{viewYear}</div>
                    </div>
                    <button onClick={nextMonth} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                </div>

                {/* Day names */}
                <div className="grid grid-cols-7 px-3 pt-3 pb-1">
                    {DAY_NAMES.map(d => (
                        <div key={d} className="text-center text-[10px] font-semibold text-slate-400 uppercase">{d}</div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-0.5 px-3 pb-3">
                    {days.map((d, i) => {
                        const sel = isSelected(d.day, d.current);
                        const tod = isToday(d.day, d.current);
                        return (
                            <button key={i}
                                onClick={() => selectDay(d.day, d.current)}
                                className={`w-full aspect-square rounded-xl text-sm font-medium transition-all flex items-center justify-center cursor-pointer
                                    ${!d.current ? 'text-slate-300' : 'text-slate-700 hover:bg-violet-50'}
                                    ${sel ? 'bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-md hover:shadow-lg scale-105' : ''}
                                    ${tod && !sel ? 'ring-2 ring-violet-400 ring-inset' : ''}`}>
                                {d.day}
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="px-3 pb-3 flex gap-2">
                    <button onClick={() => { const t = new Date(); selectDay(t.getDate(), true); setViewMonth(t.getMonth()); setViewYear(t.getFullYear()); }}
                        className="flex-1 py-2 text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors cursor-pointer">
                        დღეს
                    </button>
                    {value && (
                        <button onClick={clearDate}
                            className="flex-1 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer">
                            წაშლა
                        </button>
                    )}
                    <button onClick={onClose}
                        className="flex-1 py-2 text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
                        დახურვა
                    </button>
                </div>
            </div>
        </div>
    );
}
