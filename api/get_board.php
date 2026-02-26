<?php
// api/get_board.php
require 'db.php';
init_session();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
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
    // If user has no data row for some reason, return default
    echo json_encode([
        'success' => true,
        'board' => null,
        'bg_gradient' => 'ice'
    ]);
}
?>