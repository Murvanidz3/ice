<?php
// api/get_board.php
require 'db.php';
init_session();
set_security_headers();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$stmt = $pdo->prepare('SELECT board_json, bg_gradient FROM user_data WHERE user_id = ?');
$stmt->execute([$_SESSION['user_id']]);
$data = $stmt->fetch();

if ($data) {
    echo json_encode([
        'success' => true,
        'board' => json_decode($data['board_json'], true) ?: null,
        'bg_gradient' => $data['bg_gradient']
    ]);
} else {
    echo json_encode([
        'success' => true,
        'board' => null,
        'bg_gradient' => 'linear-gradient(135deg, #0c4a6e 0%, #7c3aed 30%, #c026d3 50%, #f43f5e 70%, #f97316 100%)'
    ]);
}
?>