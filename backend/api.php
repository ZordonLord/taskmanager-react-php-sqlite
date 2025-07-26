<?php
// backend/api.php

header('Content-Type: application/json');

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/functions/projects.php';
require_once __DIR__ . '/functions/tasks.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$basePath = '/api/';
if (strpos($path, $basePath) === 0) {
    $path = substr($path, strlen($basePath));
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Некорректный маршрут']);
    exit;
}

$parts = explode('/', trim($path, '/'));
$resource = $parts[0] ?? null;
$id = $parts[1] ?? null;

$input = json_decode(file_get_contents('php://input'), true);


