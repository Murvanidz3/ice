<?php
// api/login.php
require 'db.php';
init_session();
set_security_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Rate limit: max 5 login attempts per 5 minutes
if (!check_rate_limit('login', 5, 300)) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'ძალიან ბევრი მცდელობა. სცადეთ 5 წუთში.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$username = sanitize_string($data['username'] ?? '', 50);
$password = $data['password'] ?? '';

if (!$username || !$password) {
    echo json_encode(['success' => false, 'message' => 'Username and password required']);
    exit;
}

// Limit password length to prevent DoS via very long passwords
if (strlen($password) > 256) {
    echo json_encode(['success' => false, 'message' => 'Password too long']);
    exit;
}

$stmt = $pdo->prepare('SELECT id, username, password_hash, role FROM users WHERE username = ?');
$stmt->execute([$username]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password_hash'])) {
    // Regenerate session ID on login to prevent session fixation
    session_regenerate_id(true);

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['role'] = $user['role'];
    $_SESSION['_created'] = time();

    // Clear rate limit on successful login
    unset($_SESSION['_rate_login']);

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'role' => $user['role']
        ]
    ]);
} else {
    // Generic error message — don't reveal if username exists
    echo json_encode(['success' => false, 'message' => 'არასწორი მომხმარებელი ან პაროლი']);
}
?>