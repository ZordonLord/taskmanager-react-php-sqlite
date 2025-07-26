<?php
// backend/functions/projects.php

require_once __DIR__ . '/../helpers.php';

function getAllProjects($pdo) {
    try {
        $stmt = $pdo->query('SELECT * FROM projects ORDER BY created_at DESC');
        $projects = $stmt->fetchAll();
        sendJson($projects);
    } catch (PDOException $e) {
        sendError('Ошибка при получении проектов', 500);
    }
}

function getProject($pdo, $id) {
    try {
        $stmt = $pdo->prepare('SELECT * FROM projects WHERE id = ?');
        $stmt->execute([$id]);
        $project = $stmt->fetch();

        if (!$project) {
            sendError('Проект не найден', 404);
        }

        sendJson($project);
    } catch (PDOException $e) {
        sendError('Ошибка при получении проекта', 500);
    }
}

function createProject($pdo, $data) {
    validateFields($data, ['title']);

    try {
        $stmt = $pdo->prepare('INSERT INTO projects (title, description) VALUES (?, ?)');
        $stmt->execute([
            $data['title'],
            $data['description'] ?? null
        ]);

        sendJson([
            'message' => 'Проект успешно создан',
            'id' => $pdo->lastInsertId()
        ], 201);
    } catch (PDOException $e) {
        sendError('Ошибка при создании проекта', 500);
    }
}

function updateProject($pdo, $id, $data) {
    validateFields($data, ['title']);

    try {
        $stmt = $pdo->prepare('UPDATE projects SET title = ?, description = ? WHERE id = ?');
        $stmt->execute([
            $data['title'],
            $data['description'] ?? null,
            $id
        ]);

        if ($stmt->rowCount() === 0) {
            sendError('Проект не найден или не изменён', 404);
        }

        sendJson(['message' => 'Проект обновлён']);
    } catch (PDOException $e) {
        sendError('Ошибка при обновлении проекта', 500);
    }
}

function deleteProject($pdo, $id) {
    try {
        $stmt = $pdo->prepare('DELETE FROM projects WHERE id = ?');
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            sendError('Проект не найден', 404);
        }

        sendJson(['message' => 'Проект удалён']);
    } catch (PDOException $e) {
        sendError('Ошибка при удалении проекта', 500);
    }
}
