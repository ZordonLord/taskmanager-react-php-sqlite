import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProjectList.css';

function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      axios.get(`/api/projects/${id}`),
      axios.get(`/api/tasks?project_id=${id}`)
    ])
      .then(([projRes, tasksRes]) => {
        setProject(projRes.data);
        setTasks(tasksRes.data.filter(task => task.project_id == id));
      })
      .catch(() => setError('Ошибка загрузки данных'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!project) return <p>Проект не найден</p>;

  return (
    <div className="project-list-container">
      <h1>{project.title}</h1>
      <p className="project-description">{project.description}</p>
      <h2>Задачи проекта</h2>
      {tasks.length === 0 ? (
        <p>Задач пока нет.</p>
      ) : (
        <div className="project-grid">
          {tasks.map(task => (
            <div className="card project-card" key={task.id}>
              <strong className="project-title">{task.title}</strong>
              <p className="project-description">{task.description}</p>
              <div style={{marginTop: '1em', fontSize: '0.95em'}}>
                <span>Статус: <b>{task.status}</b></span><br/>
                <span>Приоритет: <b>{task.priority}</b></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectPage; 