<?php
// api/manage_users.php
require 'db.php';
init_session();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'list') {
    $stmt = $pdo->query('SELECT id, username, role, created_at FROM users ORDER BY created_at DESC');
    $users = $stmt->fetchAll();
    echo json_encode(['success' => true, 'users' => $users]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create') {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';

    if (!$username || !$password) {
        echo json_encode(['success' => false, 'message' => 'Username and password required']);
        exit;
    }

    try {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, "user")');
        $stmt->execute([$username, $hash]);
        $userId = $pdo->lastInsertId();

        // Generate default template projects with random cards
        $defaultBoard = getDefaultTemplateBoard();
        $auroraGradient = 'linear-gradient(135deg, #0c4a6e 0%, #7c3aed 30%, #c026d3 50%, #f43f5e 70%, #f97316 100%)';

        $stmt2 = $pdo->prepare('INSERT INTO user_data (user_id, board_json, bg_gradient) VALUES (?, ?, ?)');
        $stmt2->execute([$userId, json_encode($defaultBoard, JSON_UNESCAPED_UNICODE), $auroraGradient]);

        echo json_encode(['success' => true, 'message' => 'User created']);
    } catch (\PDOException $e) {
        if ($e->errorInfo[1] == 1062) {
            echo json_encode(['success' => false, 'message' => 'Username already exists']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Database error']);
        }
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'delete') {
    $data = json_decode(file_get_contents('php://input'), true);
    $deleteId = $data['id'] ?? null;

    if (!$deleteId || $deleteId == $_SESSION['user_id']) {
        echo json_encode(['success' => false, 'message' => 'Invalid user ID or cannot delete yourself']);
        exit;
    }

    $stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
    $stmt->execute([$deleteId]);
    echo json_encode(['success' => true, 'message' => 'User deleted']);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid action']);

// ---- Helper: Generate default template board for new users ----
function getDefaultTemplateBoard()
{
    $uid = function () {
        return substr(str_shuffle('abcdefghijklmnopqrstuvwxyz0123456789'), 0, 10); };

    $card = function ($title, $opts = []) use ($uid) {
        return array_merge([
            'id' => $uid(),
            'title' => $title,
            'description' => '',
            'labels' => [],
            'checklist' => [],
            'dueDate' => null,
            'coverColor' => null,
            'attachments' => [],
            'createdAt' => date('c'),
        ], $opts);
    };

    $makeProject = function ($name, $listNames, $cardGroups) use ($uid, $card) {
        $lists = [];
        $cards = new \stdClass();
        $listOrder = [];

        foreach ($listNames as $i => $listName) {
            $listId = $uid();
            $cardIds = [];
            if (isset($cardGroups[$i])) {
                foreach ($cardGroups[$i] as $cData) {
                    $c = $card($cData['title'], $cData);
                    $cards->{$c['id']} = $c;
                    $cardIds[] = $c['id'];
                }
            }
            $lists[] = ['id' => $listId, 'title' => $listName, 'cardIds' => $cardIds];
            $listOrder[] = $listId;
        }

        return [
            'id' => $uid(),
            'name' => $name,
            'lists' => $lists,
            'cards' => $cards,
            'listOrder' => $listOrder,
        ];
    };

    $projects = [];

    $projects[] = $makeProject(
        '🚀 კოსმოსური მისია',
        ['დაგეგმილი', 'მიმდინარე', 'ტესტირება', 'გაფრენისთვის მზად'],
        [
            [
                ['title' => 'რაკეტის საწვავის შეკვეთა', 'labels' => ['red', 'orange'], 'coverColor' => '#ef4444', 'dueDate' => '2026-04-15', 'description' => 'ძრავებისთვის საჭიროა 500 ლიტრი კოსმოსური საწვავი.'],
                ['title' => 'მარსის რუკის შედგენა', 'labels' => ['emerald'], 'coverColor' => '#10b981'],
            ],
            [
                ['title' => 'ასტრონავტების ტრენინგი', 'labels' => ['blue', 'cyan'], 'description' => 'გუნდმა უნდა გაიაროს ფიზიკური და ფსიქოლოგიური მომზადება.'],
                ['title' => 'სკაფანდრების შეკერა', 'labels' => ['pink', 'amber']],
            ],
            [
                ['title' => 'კომუნიკაციის სისტემის ტესტირება', 'labels' => ['violet'], 'dueDate' => '2026-03-20'],
            ],
            [
                ['title' => 'კოსმოსური საკვების მომზადება', 'labels' => ['orange'], 'coverColor' => '#f97316'],
            ],
        ]
    );

    $projects[] = $makeProject(
        '🍕 პიცერია "მთვარე"',
        ['იდეები', 'მუშავდება', 'ამოწმებს შეფი', 'მზადაა'],
        [
            [
                ['title' => 'ავეჯის შეძენა ტერასისთვის', 'labels' => ['emerald', 'cyan'], 'description' => '10 მაგიდა და 40 სკამი.'],
                ['title' => 'მზარეულის შერჩევა', 'labels' => ['red']],
            ],
            [
                ['title' => 'მენიუს განახლება', 'labels' => ['amber', 'orange'], 'coverColor' => '#f59e0b'],
                ['title' => 'ონლაინ შეკვეთის აპი', 'labels' => ['violet'], 'coverColor' => '#8b5cf6', 'dueDate' => '2026-04-01'],
            ],
            [
                ['title' => 'მიტანის სერვისის გაშვება', 'labels' => ['blue'], 'dueDate' => '2026-03-10'],
            ],
            [],
        ]
    );

    $projects[] = $makeProject(
        '🎬 ფილმის გადაღება',
        ['პრე-პროდაქშენი', 'გადაღება', 'პოსტ-პროდაქშენი', 'გამოსაშვები'],
        [
            [
                ['title' => 'სცენარის გადაწერა', 'labels' => ['violet', 'pink'], 'coverColor' => '#8b5cf6'],
                ['title' => 'ლოკაციების მოძიება', 'labels' => ['emerald']],
                ['title' => 'მსახიობების კასტინგი', 'labels' => ['red', 'amber'], 'dueDate' => '2026-03-15'],
            ],
            [],
            [
                ['title' => 'საუნდტრეკის ჩაწერა', 'labels' => ['cyan', 'blue'], 'coverColor' => '#06b6d4'],
                ['title' => 'პოსტერის დიზაინი', 'labels' => ['orange']],
            ],
            [
                ['title' => 'ტრეილერის მონტაჟი', 'labels' => ['pink'], 'dueDate' => '2026-05-01'],
            ],
        ]
    );

    $projects[] = $makeProject(
        '🏠 სახლის რემონტი',
        ['შესასყიდი', 'მიმდინარე', 'ოსტატის ლოდინი', 'მზადაა ✅'],
        [
            [
                ['title' => 'პარკეტის დაგება', 'labels' => ['amber', 'orange'], 'description' => 'მუხის პარკეტი 85 კვ.მ.'],
                ['title' => 'სამზარეულოს კარადები', 'labels' => ['emerald'], 'coverColor' => '#10b981'],
            ],
            [
                ['title' => 'კედლების შეღებვა', 'labels' => ['blue', 'cyan'], 'coverColor' => '#3b82f6'],
            ],
            [
                ['title' => 'სანტექნიკა აბაზანაში', 'labels' => ['red'], 'dueDate' => '2026-03-25'],
                ['title' => 'ელექტროგაყვანილობის შემოწმება', 'labels' => ['violet'], 'dueDate' => '2026-03-12'],
            ],
            [],
        ]
    );

    $projects[] = $makeProject(
        '🏃 მარათონის მომზადება',
        ['მოსამზადებელი', 'ტრენინგი', 'შესამოწმებელი', 'შესრულებული 🏅'],
        [
            [
                ['title' => 'სარბენი ფეხსაცმლის შეძენა', 'labels' => ['orange'], 'dueDate' => '2026-03-05'],
                ['title' => 'კვების რეჟიმის განახლება', 'labels' => ['amber', 'red']],
            ],
            [
                ['title' => 'სავარჯიშო გეგმის შედგენა', 'labels' => ['emerald', 'cyan'], 'coverColor' => '#10b981'],
                ['title' => 'საცდელი 21 კმ', 'labels' => ['emerald']],
            ],
            [
                ['title' => 'რეგისტრაცია რბოლაზე', 'labels' => ['pink', 'violet'], 'dueDate' => '2026-03-15'],
            ],
            [
                ['title' => 'GPS საათის დაყენება', 'labels' => ['blue'], 'coverColor' => '#3b82f6'],
            ],
        ]
    );

    return [
        'projects' => $projects,
        'activeProjectId' => $projects[0]['id'],
    ];
}
?>