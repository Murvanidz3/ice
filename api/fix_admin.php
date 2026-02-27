<?php
// api/fix_admin.php — ONE-TIME script to fix admin data
// DELETE THIS FILE AFTER USE!
require 'db.php';

// Fix the board_json format for admin user
$correctJson = json_encode([
    'projects' => [
        [
            'id' => 'proj-1',
            'name' => 'პროექტი 1',
            'lists' => [],
            'cards' => (object) [],
            'listOrder' => []
        ]
    ],
    'activeProjectId' => 'proj-1'
], JSON_UNESCAPED_UNICODE);

$stmt = $pdo->prepare('UPDATE user_data SET board_json = ? WHERE user_id = (SELECT id FROM users WHERE username = ?)');
$stmt->execute([$correctJson, 'admin']);

echo json_encode([
    'success' => true,
    'message' => 'Admin board data fixed',
    'rows_affected' => $stmt->rowCount(),
    'json_preview' => substr($correctJson, 0, 200)
]);
?>