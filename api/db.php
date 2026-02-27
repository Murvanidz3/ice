<?php
// api/db.php — Database connection and session setup

// --- Error reporting: hide details in production ---
error_reporting(0);
ini_set('display_errors', '0');

$host = 'localhost';
$db = 'u888090391_ice';
$user = 'u888090391_ice';
$pass = 'Tormeti21!';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Never expose DB error details to client
    http_response_code(500);
    die(json_encode(['success' => false, 'message' => 'Service unavailable']));
}

// Function to start session securely
function init_session()
{
    if (session_status() === PHP_SESSION_NONE) {
        // Use strict mode to prevent session fixation
        ini_set('session.use_strict_mode', '1');
        ini_set('session.use_only_cookies', '1');

        session_set_cookie_params([
            'lifetime' => 86400 * 7, // 7 days (reduced from 30)
            'path' => '/',
            'secure' => true, // Always enforce HTTPS
            'httponly' => true,
            'samesite' => 'Lax'
        ]);
        session_start();

        // Regenerate session ID periodically to prevent fixation
        if (!isset($_SESSION['_created'])) {
            $_SESSION['_created'] = time();
        } else if (time() - $_SESSION['_created'] > 3600) {
            // Regenerate session every hour
            session_regenerate_id(true);
            $_SESSION['_created'] = time();
        }
    }
}

// Add security headers to all API responses
function set_security_headers()
{
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Cache-Control: no-store, no-cache, must-revalidate');
    header('Pragma: no-cache');
}

// Rate limiting helper (per IP, stored in session)
function check_rate_limit($action, $maxAttempts = 5, $windowSeconds = 300)
{
    $key = '_rate_' . $action;
    $now = time();

    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = [];
    }

    // Clean old entries
    $_SESSION[$key] = array_filter($_SESSION[$key], fn($t) => ($now - $t) < $windowSeconds);

    if (count($_SESSION[$key]) >= $maxAttempts) {
        return false; // Rate limited
    }

    $_SESSION[$key][] = $now;
    return true;
}

// Input sanitization helper
function sanitize_string($input, $maxLength = 255)
{
    if (!is_string($input))
        return '';
    $input = trim($input);
    $input = mb_substr($input, 0, $maxLength, 'UTF-8');
    return $input;
}
?>