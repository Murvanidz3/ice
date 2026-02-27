<?php
// api/update_bg.php
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

$data = json_decode(file_get_contents('php://input'), true);
$bgGradient = sanitize_string($data['bgGradient'] ?? '', 500);

if (!$bgGradient) {
    echo json_encode(['success' => false, 'message' => 'Invalid gradient']);
    exit;
}

$stmt = $pdo->prepare('UPDATE user_data SET bg_gradient = ? WHERE user_id = ?');
$stmt->execute([$bgGradient, $_SESSION['user_id']]);

echo json_encode(['success' => true]);
?>