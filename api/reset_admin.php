<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

require 'db.php';

$username = 'admin';
$password = 'nimda';
$hash = password_hash($password, PASSWORD_DEFAULT);

try {
    // Check if user exists
    $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user) {
        // Update existing user
        $stmt = $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
        $stmt->execute([$hash, $user['id']]);
        echo "<h3>წარმატება! Admin პაროლი დარეზეტდა.</h3>";
        echo "<p>ახალი პაროლი არის: <strong>" . htmlspecialchars($password) . "</strong></p>";
    } else {
        // Create new admin user
        $stmt = $pdo->prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)');
        $stmt->execute([$username, $hash, 'admin']);
        $userId = $pdo->lastInsertId();
        
        // Insert empty default board for new user
        $defaultData = '{"projects":[{"id":"proj-1","name":"პროექტი 1","lists":[],"cards":{},"listOrder":[]}],"activeProjectId":"proj-1"}';
        $defaultBg = 'linear-gradient(135deg, #0c4a6e 0%, #7c3aed 30%, #c026d3 50%, #f43f5e 70%, #f97316 100%)';
        
        $stmt2 = $pdo->prepare('INSERT INTO user_data (user_id, board_json, bg_gradient) VALUES (?, ?, ?)');
        $stmt2->execute([$userId, $defaultData, $defaultBg]);
        
        echo "<h3>წარმატება! Admin ექაუნთი თავიდან შეიქმნა.</h3>";
        echo "<p>სისტემაში შესასვლელი პაროლი არის: <strong>" . htmlspecialchars($password) . "</strong></p>";
    }
    
    echo "<p style='color:red'><strong>ყურადღება:</strong> სისტემაში წარმატებით შესვლის შემდეგ, აუცილებლად წაშალე `reset_admin.php` ფაილი სერვერიდან(გინდ გიტჰაბზე წაშალე და ატვირთე, გინდ პირდაპირ Hostinger-ზე), რადგან უცხო პირმა არ გამოიყენოს ის.</p>";

} catch (Exception $e) {
    echo "<h3>სისტემური ხარვეზი!</h3>";
    echo "<p>ერორი: " . htmlspecialchars($e->getMessage()) . "</p>";
}
?>
