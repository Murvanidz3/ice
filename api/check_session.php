<?php
// api/check_session.php
require 'db.php';
init_session();

header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'],
            'role' => $_SESSION['role']
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
}
?>