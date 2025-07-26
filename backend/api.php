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

switch ($resource) {
    case 'projects':
        switch ($method) {
            case 'GET':
                if ($id) {
                    getProject($pdo, $id);
                } else {
                    getAllProjects($pdo);
                }
                break;
            case 'POST':
                createProject($pdo, $input);
                break;
            case 'PUT':
                if ($id) {
                    updateProject($pdo, $id, $input);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Не указан ID проекта']);
                }
                break;
            case 'DELETE':
                if ($id) {
                    deleteProject($pdo, $id);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Не указан ID проекта']);
                }
                break;
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Метод не поддерживается']);
        }
        break;

    case 'tasks':
        switch ($method) {
            case 'GET':
                if ($id) {
                    getTask($pdo, $id);
                } else {
                    getAllTasks($pdo);
                }
                break;
            case 'POST':
                createTask($pdo, $input);
                break;
            case 'PUT':
                if ($id) {
                    updateTask($pdo, $id, $input);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Не указан ID задачи']);
                }
                break;
            case 'DELETE':
                if ($id) {
                    deleteTask($pdo, $id);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Не указан ID задачи']);
                }
                break;
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Метод не поддерживается']);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Неизвестный ресурс']);
}
