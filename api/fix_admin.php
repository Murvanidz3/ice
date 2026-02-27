<?php
// api/fix_admin.php — ONE-TIME script to fix admin password
// DELETE THIS FILE AFTER USE!
require 'db.php';

$newHash = password_hash('nimda', PASSWORD_DEFAULT);
$stmt = $pdo->prepare('UPDATE users SET password_hash = ? WHERE username = ?');
$stmt->execute([$newHash, 'admin']);

echo json_encode([
    'success' => true,
    'message' => 'Admin password updated',
    'rows_affected' => $stmt->rowCount()
]);
?>
