<?php
// api/update_board.php
require 'db.php';
init_session();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$jsonInput = file_get_contents('php://input');
// Validate if it's valid JSON
if (!json_decode($jsonInput)) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

$stmt = $pdo->prepare('UPDATE user_data SET board_json = ? WHERE user_id = ?');
$stmt->execute([$jsonInput, $_SESSION['user_id']]);

echo json_encode(['success' => true]);
?>