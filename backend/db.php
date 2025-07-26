<?php
// backend/db.php

try {
    $dbPath = __DIR__ . '/../data/database.sqlite';

    $pdo = new PDO('sqlite:' . $dbPath);

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Ошибка подключения к базе данных',
        'details' => $e->getMessage()
    ]);
    exit;
}