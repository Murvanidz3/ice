import { useState, useCallback, useRef, useMemo } from 'react';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    closestCorners,
    pointerWithin,
    rectIntersection,
} from '@dnd-kit/core';
import {
    SortableContext,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import List from './List';
import Card from './Card';
import AddList from './AddList';

export default function Board({
    data,
    addList,
    updateListTitle,
    deleteList,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    moveCardToList,
    reorderLists,
    openCard,
}) {
    const [activeId, setActiveId] = useState(null);
    const [activeType, setActiveType] = useState(null);
    const lastOverIdRef = useRef(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 200, tolerance: 8 },
        })
    );

    // Find which list contains a card
    const findListByCardId = useCallback(
        (cardId) => {
            return data.lists.find((l) => l.cardIds.includes(cardId));
        },
        [data.lists]
    );

    // Determine if an id is a list or card
    const isListId = useCallback(
        (id) => data.listOrder.includes(id),
        [data.listOrder]
    );

    // Custom collision detection
    const collisionDetection = useCallback(
        (args) => {
            if (activeType === 'list') {
                return closestCorners(args);
            }

            // For cards, use pointer within first, then fall back to rect intersection
            const pointerCollisions = pointerWithin(args);
            if (pointerCollisions.length > 0) {
                return pointerCollisions;
            }
            return rectIntersection(args);
        },
        [activeType]
    );

    const handleDragStart = useCallback(
        (event) => {
            const { active } = event;
            const id = active.id;
            if (isListId(id)) {
                setActiveType('list');
            } else {
                setActiveType('card');
            }
            setActiveId(id);
        },
        [isListId]
    );

    const handleDragOver = useCallback(
        (event) => {
            const { active, over } = event;
            if (!over || activeType !== 'card') return;

            const activeId = active.id;
            const overId = over.id;

            if (activeId === overId) return;

            const activeList = findListByCardId(activeId);
            let overList;

            if (isListId(overId)) {
                // Dropping over a list container
                overList = data.lists.find((l) => l.id === overId);
            } else {
                overList = findListByCardId(overId);
            }

            if (!activeList || !overList) return;

            // Only handle cross-list moves here
            if (activeList.id !== overList.id) {
                const overIdForMove = isListId(overId) ? null : overId;
                moveCard(activeId, overIdForMove, activeList.id, overList.id);
            }
        },
        [activeType, findListByCardId, isListId, data.lists, moveCard]
    );

    const handleDragEnd = useCallback(
        (event) => {
            const { active, over } = event;

            if (!over) {
                setActiveId(null);
                setActiveType(null);
                return;
            }

            const activeId = active.id;
            const overId = over.id;

            if (activeType === 'list') {
                if (activeId !== overId && isListId(overId)) {
                    reorderLists(activeId, overId);
                }
            } else {
                // Card reorder within same list
                if (activeId !== overId) {
                    const activeList = findListByCardId(activeId);
                    const overList = isListId(overId)
                        ? data.lists.find((l) => l.id === overId)
                        : findListByCardId(overId);

                    if (activeList && overList && activeList.id === overList.id) {
                        moveCard(activeId, overId, activeList.id, overList.id);
                    }
                }
            }

            setActiveId(null);
            setActiveType(null);
        },
        [activeType, findListByCardId, isListId, data.lists, moveCard, reorderLists]
    );

    const activeCard =
        activeType === 'card' && activeId ? data.cards[activeId] : null;
    const activeList =
        activeType === 'list' && activeId
            ? data.lists.find((l) => l.id === activeId)
            : null;

    const listIds = useMemo(() => data.lists.map((l) => l.id), [data.lists]);

    return (
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-3 sm:p-6">
            <DndContext
                sensors={sensors}
                collisionDetection={collisionDetection}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
                    <div className="flex gap-4 items-start h-full">
                        {data.lists.map((list) => (
                            <List
                                key={list.id}
                                list={list}
                                cards={list.cardIds.map((id) => data.cards[id]).filter(Boolean)}
                                addCard={addCard}
                                updateListTitle={updateListTitle}
                                deleteList={deleteList}
                                openCard={openCard}
                                isDraggingCard={activeType === 'card'}
                            />
                        ))}
                        <AddList onAdd={addList} />
                    </div>
                </SortableContext>

                <DragOverlay dropAnimation={null}>
                    {activeCard && (
                        <div className="drag-overlay">
                            <Card card={activeCard} isOverlay />
                        </div>
                    )}
                    {activeList && (
                        <div className="drag-overlay opacity-70 w-[300px]">
                            <div className="glass-list rounded-xl p-3">
                                <div className="font-semibold text-white px-1 py-1">
                                    {activeList.title}
                                </div>
                                <div className="mt-2 space-y-2">
                                    {activeList.cardIds
                                        .map((id) => data.cards[id])
                                        .filter(Boolean)
                                        .slice(0, 3)
                                        .map((card) => (
                                            <Card key={card.id} card={card} isOverlay />
                                        ))}
                                    {activeList.cardIds.length > 3 && (
                                        <div className="text-white/60 text-xs text-center py-1">
                                            +{activeList.cardIds.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
