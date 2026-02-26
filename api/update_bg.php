<?php
// api/update_bg.php
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

$data = json_decode(file_get_contents('php://input'), true);
$bgGradient = $data['bgGradient'] ?? 'ice';

$stmt = $pdo->prepare('UPDATE user_data SET bg_gradient = ? WHERE user_id = ?');
$stmt->execute([$bgGradient, $_SESSION['user_id']]);

echo json_encode(['success' => true]);
?>