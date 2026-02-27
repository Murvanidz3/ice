<?php
// api/change_password.php
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

// Rate limit: max 5 password changes per 15 minutes
if (!check_rate_limit('change_password', 5, 900)) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'ძალიან ბევრი მცდელობა. სცადეთ მოგვიანებით.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$currentPassword = $data['currentPassword'] ?? '';
$newPassword = $data['newPassword'] ?? '';

if (!$currentPassword || !$newPassword) {
    echo json_encode(['success' => false, 'message' => 'Both passwords are required']);
    exit;
}

// Validate new password
if (mb_strlen($newPassword) < 3) {
    echo json_encode(['success' => false, 'message' => 'პაროლი მინიმუმ 3 სიმბოლო']);
    exit;
}
if (strlen($newPassword) > 256) {
    echo json_encode(['success' => false, 'message' => 'Password too long']);
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