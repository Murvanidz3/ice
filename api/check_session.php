<?php
// api/check_session.php
require 'db.php';
init_session();
set_security_headers();

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
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
}
?>