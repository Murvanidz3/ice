<?php
// api/manage_users.php
require 'db.php';
init_session();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'list') {
    $stmt = $pdo->query('SELECT id, username, role, created_at FROM users ORDER BY created_at DESC');
    $users = $stmt->fetchAll();
    echo json_encode(['success' => true, 'users' => $users]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create') {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';

    if (!$username || !$password) {
        echo json_encode(['success' => false, 'message' => 'Username and password required']);
        exit;
    }

    try {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, "user")');
        $stmt->execute([$username, $hash]);
        $userId = $pdo->lastInsertId();

        // Initialize empty board for user
        $emptyBoard = json_encode([
            'lists' => [['id' => 'list-1', 'title' => 'პროექტი 1', 'cardIds' => []]],
            'cards' => new stdClass(),
            'listOrder' => ['list-1']
        ]);

        $stmt2 = $pdo->prepare('INSERT INTO user_data (user_id, board_json, bg_gradient) VALUES (?, ?, "ice")');
        $stmt2->execute([$userId, $emptyBoard]);

        echo json_encode(['success' => true, 'message' => 'User created']);
    } catch (\PDOException $e) {
        if ($e->errorInfo[1] == 1062) {
            echo json_encode(['success' => false, 'message' => 'Username already exists']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Database error']);
        }
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'delete') {
    $data = json_decode(file_get_contents('php://input'), true);
    $deleteId = $data['id'] ?? null;

    if (!$deleteId || $deleteId == $_SESSION['user_id']) {
        echo json_encode(['success' => false, 'message' => 'Invalid user ID or cannot delete yourself']);
        exit;
    }

    $stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
    $stmt->execute([$deleteId]);
    echo json_encode(['success' => true, 'message' => 'User deleted']);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid action']);
?>