<?php
// api/change_password.php
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
$currentPassword = $data['currentPassword'] ?? '';
$newPassword = $data['newPassword'] ?? '';

if (!$currentPassword || !$newPassword) {
    echo json_encode(['success' => false, 'message' => 'Both passwords are required']);
    exit;
}

$stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ?');
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();

if ($user && password_verify($currentPassword, $user['password_hash'])) {
    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
    $updateStmt = $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    $updateStmt->execute([$newHash, $_SESSION['user_id']]);

    echo json_encode(['success' => true, 'message' => 'Password changed successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'მიმდინარე პაროლი არასწორია']);
}
?>