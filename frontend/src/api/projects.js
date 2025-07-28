// src/api/projects.js
import axios from 'axios';

export const getProjects = () => axios.get('/api/projects');
export const createProject = (data) => axios.post('/api/projects', data);
export const updateProject = (id, data) => axios.put(`/api/projects/${id}`, data);
export const deleteProject = (id) => axios.delete(`/api/projects/${id}`);
