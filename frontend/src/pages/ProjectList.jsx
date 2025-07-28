// src/pages/ProjectList.jsx
import { useEffect, useState } from 'react';
import { getProjects } from '../api/projects';
import './ProjectList.css';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProjects()
      .then(res => setProjects(res.data))
      .catch(err => setError('Ошибка загрузки проектов'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="project-list-container">
      <h1>Список проектов</h1>
      {projects.length === 0 ? (
        <p>Проектов пока нет.</p>
      ) : (
        <div className="project-grid">
          {projects.map(project => (
            <div className="card project-card" key={project.id}>
              <strong className="project-title">{project.title}</strong>
              <p className="project-description">{project.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectList;
