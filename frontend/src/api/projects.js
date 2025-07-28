// src/api/projects.js
import axios from 'axios';

export const getProjects = () => axios.get('/api/projects');
