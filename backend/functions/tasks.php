<?php
// backend/functions/tasks.php

require_once __DIR__ . '/../helpers.php';

function getAllTasks($pdo) {
    try {
        $stmt = $pdo->query('SELECT * FROM tasks ORDER BY created_at DESC');
        $tasks = $stmt->fetchAll();
        sendJson($tasks);
    } catch (PDOException $e) {
        sendError('Ошибка при получении списка задач', 500);
    }
}

function getTask($pdo, $id) {
    try {
        $stmt = $pdo->prepare('SELECT * FROM tasks WHERE id = ?');
        $stmt->execute([$id]);
        $task = $stmt->fetch();

        if (!$task) {
            sendError('Задача не найдена', 404);
        }

        sendJson($task);
    } catch (PDOException $e) {
        sendError('Ошибка при получении задачи', 500);
    }
}

function createTask($pdo, $data) {
    validateFields($data, ['title', 'project_id']);

    try {
        $stmt = $pdo->prepare('
            INSERT INTO tasks (project_id, title, description, priority, status, deadline)
            VALUES (?, ?, ?, ?, ?, ?)
        ');

        $stmt->execute([
            $data['project_id'],
            $data['title'],
            $data['description'] ?? null,
            $data['priority'] ?? 2,
            $data['status'] ?? 'todo',
            $data['deadline'] ?? null
        ]);

        sendJson([
            'message' => 'Задача успешно создана',
            'id' => $pdo->lastInsertId()
        ], 201);
    } catch (PDOException $e) {
        sendError('Ошибка при создании задачи', 500);
    }
}

function updateTask($pdo, $id, $data) {
    validateFields($data, ['title', 'project_id']);

    try {
        $stmt = $pdo->prepare('
            UPDATE tasks SET project_id = ?, title = ?, description = ?, priority = ?, status = ?, deadline = ?
            WHERE id = ?
        ');

        $stmt->execute([
            $data['project_id'],
            $data['title'],
            $data['description'] ?? null,
            $data['priority'] ?? 2,
            $data['status'] ?? 'todo',
            $data['deadline'] ?? null,
            $id
        ]);

        if ($stmt->rowCount() === 0) {
            sendError('Задача не найдена или не изменена', 404);
        }

        sendJson(['message' => 'Задача обновлена']);
    } catch (PDOException $e) {
        sendError('Ошибка при обновлении задачи', 500);
    }
}

function deleteTask($pdo, $id) {
    try {
        $stmt = $pdo->prepare('DELETE FROM tasks WHERE id = ?');
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            sendError('Задача не найдена', 404);
        }

        sendJson(['message' => 'Задача удалена']);
    } catch (PDOException $e) {
        sendError('Ошибка при удалении задачи', 500);
    }
}
