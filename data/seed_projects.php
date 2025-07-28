<?php
try {
    $dbPath = __DIR__ . '/database.sqlite';
    $db = new PDO('sqlite:' . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Проверяем, есть ли уже проекты
    $stmt = $db->query('SELECT COUNT(*) FROM projects');
    $count = $stmt->fetchColumn();

    if ($count == 0) {
        // Добавляем тестовые проекты
        $projects = [
            [
                'title' => 'Веб-сайт компании',
                'description' => 'Создание корпоративного веб-сайта с современным дизайном'
            ],
            [
                'title' => 'Мобильное приложение',
                'description' => 'Разработка iOS и Android приложения для клиентов'
            ],
            [
                'title' => 'Система управления задачами',
                'description' => 'Внутренняя система для отслеживания проектов и задач'
            ],
            [
                'title' => 'E-commerce платформа',
                'description' => 'Онлайн магазин с интеграцией платежных систем'
            ]
        ];

        $stmt = $db->prepare('INSERT INTO projects (title, description) VALUES (?, ?)');
        
        foreach ($projects as $project) {
            $stmt->execute([$project['title'], $project['description']]);
        }

        echo "Добавлено " . count($projects) . " тестовых проектов\n";

        // Получаем id всех проектов
        $projectIds = $db->query('SELECT id FROM projects')->fetchAll(PDO::FETCH_COLUMN);

        // Тестовые задачи для каждого проекта
        $tasks = [
            [
                'title' => 'Обсудить требования',
                'description' => 'Встреча с заказчиком для сбора требований',
                'priority' => 1,
                'status' => 'todo',
            ],
            [
                'title' => 'Дизайн макета',
                'description' => 'Разработать дизайн главной страницы',
                'priority' => 2,
                'status' => 'in_progress',
            ],
            [
                'title' => 'Разработка функционала',
                'description' => 'Реализовать основные функции',
                'priority' => 2,
                'status' => 'todo',
            ],
            [
                'title' => 'Тестирование',
                'description' => 'Провести тестирование и исправить баги',
                'priority' => 3,
                'status' => 'done',
            ],
        ];

        $stmt = $db->prepare('INSERT INTO tasks (project_id, title, description, priority, status) VALUES (?, ?, ?, ?, ?)');
        $taskCount = 0;
        foreach ($projectIds as $projectId) {
            foreach ($tasks as $task) {
                $stmt->execute([
                    $projectId,
                    $task['title'],
                    $task['description'],
                    $task['priority'],
                    $task['status'],
                ]);
                $taskCount++;
            }
        }
        echo "Добавлено $taskCount тестовых задач\n";

    } else {
        echo "Проекты уже существуют в базе данных\n";
    }

} catch (PDOException $e) {
    echo "Ошибка: " . $e->getMessage() . "\n";
    exit(1);
}
?> 