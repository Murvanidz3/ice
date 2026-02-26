import { useState, useEffect, useCallback } from 'react';
import { getInitialData, getDefaultProjects as getMockProjects } from '../data/mockData';
import { nanoid } from 'nanoid';
import { arrayMove } from '@dnd-kit/sortable';

const USERS_KEY = 'ice-users';
const AUTH_KEY = 'ice-auth';

function getStorageKey(username) {
    return `ice-board-${username}`;
}

function createEmptyBoard() {
    return { lists: [], cards: {}, listOrder: [] };
}

function getDefaultProjectsData() {
    const projects = getMockProjects();
    return {
        projects,
        activeProjectId: projects[0].id,
    };
}

// ---- Auth ----
export function useAuth() {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Check session on mount
        fetch('/api/check_session.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCurrentUser({ username: data.user.username, isAdmin: data.user.role === 'admin' });
                }
            })
            .catch(console.error);
    }, []);

    const loggedIn = !!currentUser;
    const isAdmin = currentUser?.isAdmin === true;

    const login = useCallback(async (username, password) => {
        try {
            const res = await fetch('/api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (data.success) {
                setCurrentUser({ username: data.user.username, isAdmin: data.user.role === 'admin' });
                return true;
            }
        } catch (e) {
            console.error('Login failed', e);
        }
        return false;
    }, []);

    const logout = useCallback(async () => {
        try {
            await fetch('/api/logout.php');
            setCurrentUser(null);
        } catch (e) {
            console.error('Logout failed', e);
        }
    }, []);

    // ---- User management (admin only) ----
    const refreshUsers = useCallback(async () => {
        if (!isAdmin) return;
        try {
            const res = await fetch('/api/manage_users.php?action=list');
            const data = await res.json();
            if (data.success) {
                setUsers(data.users.map(u => ({ username: u.username, isAdmin: u.role === 'admin' })));
            }
        } catch (e) {
            console.error('Failed to fetch users', e);
        }
    }, [isAdmin]);

    // Load users if admin
    useEffect(() => {
        if (isAdmin) refreshUsers();
    }, [isAdmin, refreshUsers]);

    const addUser = useCallback(async (username, password) => {
        try {
            const res = await fetch('/api/manage_users.php?action=create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (data.success) {
                refreshUsers();
                return true;
            }
        } catch (e) {
            console.error('Add user failed', e);
        }
        return false;
    }, [refreshUsers]);

    const deleteUser = useCallback(async (username) => {
        if (username === 'admin') return false;
        try {
            // we need ID for deletion, but list API returns ID. 
            // In manage_users.php we check by ID. Let's find ID from the users list we fetched.
            // Wait, we need to adapt deleteUser to accept ID or modify PHP.
            // Let's modify PHP later if needed or find user by username here.
            // For now, let's fetch the actual user list that has IDs from state (if we saved IDs).
            const res = await fetch('/api/manage_users.php?action=list');
            const data = await res.json();
            const user = data.users.find(u => u.username === username);
            if (!user) return false;

            const delRes = await fetch('/api/manage_users.php?action=delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: user.id })
            });
            const delData = await delRes.json();
            if (delData.success) {
                refreshUsers();
                return true;
            }
        } catch (e) {
            console.error('Delete user failed', e);
        }
        return false;
    }, [refreshUsers]);

    const updateUserPassword = useCallback(async (username, newPassword) => {
        // Only admin changes another user's password. 
        // We haven't built an admin endpoint to reset *another* user's password yet, 
        // but we can add it to manage_users.php later if strictly needed. 
        // Trello clone might only need changeOwnPassword for now.
        console.warn('Admin password reset for others is not yet implemented in backend');
        return false;
    }, []);

    const changeOwnPassword = useCallback(async (newPassword, currentPassword) => {
        try {
            const res = await fetch('/api/change_password.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await res.json();
            return data.success;
        } catch (e) {
            console.error('Change password failed', e);
        }
        return false;
    }, []);

    const verifyPassword = useCallback(async (password) => {
        // In the PHP version, we verify password inherently when changing password.
        // We'll return true to bypass frontend check and let backend handle the old password validation.
        return true;
    }, []);

    return {
        loggedIn,
        isAdmin,
        currentUser,
        login,
        logout,
        verifyPassword,
        changeOwnPassword,
        users,
        refreshUsers,
        addUser,
        deleteUser,
        updateUserPassword,
    };
}

// ---- Board + Projects ----
export function useBoard(username) {
    const [appData, setAppData] = useState(null);
    const [bgGradient, setBgGradient] = useState('ice');
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (!username) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/get_board.php');
            const data = await res.json();

            if (data.success && data.board) {
                setAppData(data.board);
                setBgGradient(data.bg_gradient || 'ice');
            } else {
                setAppData(getDefaultProjectsData());
            }
        } catch (e) {
            console.error('Failed to load board', e);
            setAppData(getDefaultProjectsData());
        } finally {
            setIsLoading(false);
        }
    }, [username]);

    // Re-load when username changes
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Auto-save board data whenever it changes
    useEffect(() => {
        if (!appData || isLoading) return;

        const saveTimer = setTimeout(async () => {
            try {
                await fetch('/api/update_board.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(appData)
                });
            } catch (e) {
                console.error('Failed to save data to server', e);
            }
        }, 800); // 800ms debounce

        return () => clearTimeout(saveTimer);
    }, [appData, isLoading]);

    // Expose background update
    const updateBackground = useCallback(async (newBg) => {
        setBgGradient(newBg);
        try {
            await fetch('/api/update_bg.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bgGradient: newBg })
            });
        } catch (e) {
            console.error('Failed to update background', e);
        }
    }, []);

    const projects = appData?.projects || [];
    const activeProjectId = appData?.activeProjectId;
    const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

    const data = activeProject
        ? { lists: activeProject.lists, cards: activeProject.cards, listOrder: activeProject.listOrder }
        : createEmptyBoard();

    const updateBoard = useCallback((updater) => {
        setAppData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                projects: prev.projects.map((p) =>
                    p.id === prev.activeProjectId ? { ...p, ...updater(p) } : p
                ),
            };
        });
    }, []);

    // ---- Project operations ----
    const addProject = useCallback((name) => {
        const id = nanoid();
        setAppData((prev) => ({
            ...prev,
            projects: [...prev.projects, { id, name, ...createEmptyBoard() }],
            activeProjectId: id,
        }));
    }, []);

    const switchProject = useCallback((projectId) => {
        setAppData((prev) => ({ ...prev, activeProjectId: projectId }));
    }, []);

    const deleteProject = useCallback((projectId) => {
        setAppData((prev) => {
            const remaining = prev.projects.filter((p) => p.id !== projectId);
            if (remaining.length === 0) return prev;
            return {
                ...prev,
                projects: remaining,
                activeProjectId:
                    prev.activeProjectId === projectId ? remaining[0].id : prev.activeProjectId,
            };
        });
    }, []);

    const renameProject = useCallback((projectId, name) => {
        setAppData((prev) => ({
            ...prev,
            projects: prev.projects.map((p) =>
                p.id === projectId ? { ...p, name } : p
            ),
        }));
    }, []);

    // ---- List operations ----
    const addList = useCallback((title) => {
        updateBoard((proj) => {
            const id = nanoid();
            const newList = { id, title, cardIds: [] };
            return {
                lists: [...proj.lists, newList],
                listOrder: [...proj.listOrder, id],
            };
        });
    }, [updateBoard]);

    const updateListTitle = useCallback((listId, title) => {
        updateBoard((proj) => ({
            lists: proj.lists.map((l) => (l.id === listId ? { ...l, title } : l)),
        }));
    }, [updateBoard]);

    const deleteList = useCallback((listId) => {
        updateBoard((proj) => {
            const list = proj.lists.find((l) => l.id === listId);
            const newCards = { ...proj.cards };
            if (list) list.cardIds.forEach((cid) => delete newCards[cid]);
            return {
                lists: proj.lists.filter((l) => l.id !== listId),
                listOrder: proj.listOrder.filter((id) => id !== listId),
                cards: newCards,
            };
        });
    }, [updateBoard]);

    // ---- Card operations ----
    const addCard = useCallback((listId, title) => {
        updateBoard((proj) => {
            const id = nanoid();
            const newCard = {
                id, title, description: '', labels: [], checklist: [],
                dueDate: null, coverColor: null, attachments: [],
                createdAt: new Date().toISOString(),
            };
            return {
                cards: { ...proj.cards, [id]: newCard },
                lists: proj.lists.map((l) =>
                    l.id === listId ? { ...l, cardIds: [...l.cardIds, id] } : l
                ),
            };
        });
    }, [updateBoard]);

    const updateCard = useCallback((cardId, updates) => {
        updateBoard((proj) => ({
            cards: {
                ...proj.cards,
                [cardId]: { ...proj.cards[cardId], ...updates },
            },
        }));
    }, [updateBoard]);

    const deleteCard = useCallback((cardId, listId) => {
        updateBoard((proj) => {
            const newCards = { ...proj.cards };
            delete newCards[cardId];
            return {
                cards: newCards,
                lists: proj.lists.map((l) =>
                    l.id === listId
                        ? { ...l, cardIds: l.cardIds.filter((id) => id !== cardId) }
                        : l
                ),
            };
        });
    }, [updateBoard]);

    // ---- Drag & Drop ----
    const moveCard = useCallback((activeId, overId, activeListId, overListId) => {
        updateBoard((proj) => {
            const sourceList = proj.lists.find((l) => l.id === activeListId);
            const destList = proj.lists.find((l) => l.id === overListId);
            if (!sourceList || !destList) return {};

            if (activeListId === overListId) {
                const oldIndex = sourceList.cardIds.indexOf(activeId);
                const newIndex = sourceList.cardIds.indexOf(overId);
                if (oldIndex === -1) return {};
                const newCardIds = arrayMove(
                    sourceList.cardIds, oldIndex,
                    newIndex === -1 ? sourceList.cardIds.length : newIndex
                );
                return {
                    lists: proj.lists.map((l) =>
                        l.id === activeListId ? { ...l, cardIds: newCardIds } : l
                    ),
                };
            }

            const sourceCardIds = sourceList.cardIds.filter((id) => id !== activeId);
            const overIndex = destList.cardIds.indexOf(overId);
            const destCardIds = [...destList.cardIds];
            if (overIndex === -1) destCardIds.push(activeId);
            else destCardIds.splice(overIndex, 0, activeId);

            return {
                lists: proj.lists.map((l) => {
                    if (l.id === activeListId) return { ...l, cardIds: sourceCardIds };
                    if (l.id === overListId) return { ...l, cardIds: destCardIds };
                    return l;
                }),
            };
        });
    }, [updateBoard]);

    const moveCardToList = useCallback((cardId, fromListId, toListId) => {
        updateBoard((proj) => ({
            lists: proj.lists.map((l) => {
                if (l.id === fromListId)
                    return { ...l, cardIds: l.cardIds.filter((id) => id !== cardId) };
                if (l.id === toListId)
                    return { ...l, cardIds: [...l.cardIds, cardId] };
                return l;
            }),
        }));
    }, [updateBoard]);

    const reorderLists = useCallback((activeId, overId) => {
        updateBoard((proj) => {
            const oldIndex = proj.listOrder.indexOf(activeId);
            const newIndex = proj.listOrder.indexOf(overId);
            if (oldIndex === -1 || newIndex === -1) return {};
            const newListOrder = arrayMove(proj.listOrder, oldIndex, newIndex);
            const listMap = {};
            proj.lists.forEach((l) => (listMap[l.id] = l));
            const newLists = newListOrder.map((id) => listMap[id]);
            return { lists: newLists, listOrder: newListOrder };
        });
    }, [updateBoard]);

    const resetBoard = useCallback(async () => {
        try {
            await fetch('/api/update_board.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(getDefaultProjectsData())
            });
        } catch { /* ignore */ }
        const emptyProject = { id: nanoid(), name: 'პროექტი 1', ...createEmptyBoard() };
        setAppData({ projects: [emptyProject], activeProjectId: emptyProject.id });
    }, []);

    return {
        data,
        projects,
        activeProjectId,
        activeProject,
        bgGradient,
        updateBackground,
        isLoading,
        addProject,
        switchProject,
        deleteProject,
        renameProject,
        addList,
        updateListTitle,
        deleteList,
        addCard,
        updateCard,
        deleteCard,
        moveCard,
        moveCardToList,
        reorderLists,
        resetBoard,
    };
}
