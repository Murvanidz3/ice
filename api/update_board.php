<?php
// api/update_board.php
require 'db.php';
init_session();
set_security_headers();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$jsonInput = file_get_contents('php://input');

// Limit board data size to 5MB to prevent abuse
if (strlen($jsonInput) > 5 * 1024 * 1024) {
    http_response_code(413);
    echo json_encode(['success' => false, 'message' => 'Data too large']);
    exit;
}

// Validate JSON
if (!json_decode($jsonInput)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

$stmt = $pdo->prepare('UPDATE user_data SET board_json = ? WHERE user_id = ?');
$stmt->execute([$jsonInput, $_SESSION['user_id']]);

echo json_encode(['success' => true]);
?>