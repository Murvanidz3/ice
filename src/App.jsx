import { useState } from 'react';
import Board from './components/Board';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CardModal from './components/CardModal';
import Login from './components/Login';
import UserManager from './components/UserManager';
import { useBoard, useAuth } from './hooks/useBoard';

export default function App() {
    const auth = useAuth();
    const { loggedIn, isAdmin, currentUser, login, logout, verifyPassword, changeOwnPassword, users, addUser, deleteUser, updateUserPassword } = auth;

    // We pass username to useBoard so it fetches the correct data
    const board = useBoard(currentUser?.username);
    const { bgGradient, updateBackground, isLoading } = board;
    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedCardListId, setSelectedCardListId] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showUserManager, setShowUserManager] = useState(false);

    if (!loggedIn) {
        return <Login onLogin={login} />;
    }

    if (isLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 gradient-bg-ice`}>
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    const openCard = (cardId, listId) => {
        setSelectedCard(cardId);
        setSelectedCardListId(listId);
    };

    const closeCard = () => {
        setSelectedCard(null);
        setSelectedCardListId(null);
    };

    return (
        <div className="h-full flex flex-col">
            <Header
                activeProject={board.activeProject}
                currentUser={currentUser}
                isAdmin={isAdmin}
                resetBoard={board.resetBoard}
                logout={logout}
                verifyPassword={verifyPassword}
                changeOwnPassword={changeOwnPassword}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
                onOpenUserManager={() => setShowUserManager(true)}
                bgGradient={bgGradient}
                updateBackground={updateBackground}
            />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    projects={board.projects}
                    activeProjectId={board.activeProjectId}
                    switchProject={board.switchProject}
                    addProject={board.addProject}
                    deleteProject={board.deleteProject}
                    renameProject={board.renameProject}
                    collapsed={sidebarCollapsed}
                    setCollapsed={setSidebarCollapsed}
                />
                <Board
                    data={board.data}
                    addList={board.addList}
                    updateListTitle={board.updateListTitle}
                    deleteList={board.deleteList}
                    addCard={board.addCard}
                    updateCard={board.updateCard}
                    deleteCard={board.deleteCard}
                    moveCard={board.moveCard}
                    moveCardToList={board.moveCardToList}
                    reorderLists={board.reorderLists}
                    openCard={openCard}
                />
            </div>
            {selectedCard && board.data.cards[selectedCard] && (
                <CardModal
                    card={board.data.cards[selectedCard]}
                    listId={selectedCardListId}
                    lists={board.data.lists}
                    updateCard={board.updateCard}
                    deleteCard={board.deleteCard}
                    moveCardToList={board.moveCardToList}
                    onClose={closeCard}
                />
            )}
            {showUserManager && isAdmin && (
                <UserManager
                    users={users}
                    addUser={addUser}
                    deleteUser={deleteUser}
                    updateUserPassword={updateUserPassword}
                    onClose={() => setShowUserManager(false)}
                />
            )}
        </div>
    );
}
