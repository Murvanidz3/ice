<?php
// api/fix_admin.php — ONE-TIME migration: widen bg_gradient column + set Aurora default
// DELETE THIS FILE AFTER USE!
require 'db.php';

// 1. Alter column to support full gradient strings
$pdo->exec("ALTER TABLE user_data MODIFY COLUMN bg_gradient VARCHAR(500) DEFAULT 'linear-gradient(135deg, #0c4a6e 0%, #7c3aed 30%, #c026d3 50%, #f43f5e 70%, #f97316 100%)'");

// 2. Update existing users with short 'ice' value to Aurora gradient
$auroraGradient = 'linear-gradient(135deg, #0c4a6e 0%, #7c3aed 30%, #c026d3 50%, #f43f5e 70%, #f97316 100%)';
$stmt = $pdo->prepare("UPDATE user_data SET bg_gradient = ? WHERE bg_gradient = 'ice' OR LENGTH(bg_gradient) < 10");
$stmt->execute([$auroraGradient]);

echo json_encode([
    'success' => true,
    'message' => 'Column widened and Aurora gradient set as default',
    'rows_updated' => $stmt->rowCount()
]);
?>