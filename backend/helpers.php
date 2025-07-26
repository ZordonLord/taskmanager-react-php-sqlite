<?php
// backend/helpers.php

function sendJson($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function sendError($message, $code = 400) {
    sendJson(['error' => $message], $code);
}

function validateFields($data, $requiredFields) {
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || $data[$field] === '') {
            sendError("Отсутствует обязательное поле: $field", 400);
        }
    }
}
