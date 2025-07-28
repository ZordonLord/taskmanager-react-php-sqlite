// src/api/tasks.js
import axios from 'axios';

export const getTasks = () => axios.get('/api/tasks');
export const createTask = (data) => axios.post('/api/tasks', data);
export const updateTask = (id, data) => axios.put(`/api/tasks/${id}`, data);
export const deleteTask = (id) => axios.delete(`/api/tasks/${id}`); 