// src/pages/ProjectList.jsx
import { useEffect, useState } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../api/projects';
import './ProjectList.css';
import { useNavigate } from 'react-router-dom';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editProject, setEditProject] = useState({ title: '', description: '' });

  useEffect(() => {
    getProjects()
      .then(res => setProjects(res.data))
      .catch(err => setError('Ошибка загрузки проектов'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    setAdding(true);
    try {
      await createProject(newProject);
      setNewProject({ title: '', description: '' });
      setProjects(await getProjects().then(res => res.data));
    } catch {
      setError('Ошибка при добавлении проекта');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить проект?')) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch {
      setError('Ошибка при удалении проекта');
    }
  };

  const handleEdit = (project) => {
    setEditId(project.id);
    setEditProject({ title: project.title, description: project.description });
  };

  const handleEditSave = async (id) => {
    try {
      await updateProject(id, editProject);
      setProjects(await getProjects().then(res => res.data));
      setEditId(null);
    } catch {
      setError('Ошибка при обновлении проекта');
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="project-list-container">
      <h1>Список проектов</h1>
      <form className="project-form" onSubmit={handleAddProject} style={{marginBottom: '2em'}}>
        <input
          type="text"
          placeholder="Название проекта"
          value={newProject.title}
          onChange={e => setNewProject({ ...newProject, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Описание проекта"
          value={newProject.description}
          onChange={e => setNewProject({ ...newProject, description: e.target.value })}
        />
        <button type="submit" disabled={adding}>Добавить</button>
      </form>
      {projects.length === 0 ? (
        <p>Проектов пока нет.</p>
      ) : (
        <div className="project-grid">
          {projects.map(project => (
            editId === project.id ? (
              <div className="card project-card" key={project.id}>
                <input
                  type="text"
                  value={editProject.title}
                  onChange={e => setEditProject({ ...editProject, title: e.target.value })}
                  required
                  style={{width: '100%', marginBottom: '0.5em'}}
                />
                <input
                  type="text"
                  value={editProject.description}
                  onChange={e => setEditProject({ ...editProject, description: e.target.value })}
                  style={{width: '100%', marginBottom: '0.5em'}}
                />
                <button onClick={() => handleEditSave(project.id)} style={{marginRight: '0.5em'}}>Сохранить</button>
                <button onClick={handleEditCancel} type="button">Отмена</button>
              </div>
            ) : (
              <div className="card project-card" key={project.id} onClick={() => navigate(`/project/${project.id}`)} style={{cursor: 'pointer', position: 'relative'}}>
                <strong className="project-title">{project.title}</strong>
                <p className="project-description">{project.description}</p>
                <div style={{display: 'flex', justifyContent: 'center', gap: '0.5em', marginTop: '1em'}} onClick={e => e.stopPropagation()}>
                  <button onClick={() => handleEdit(project)} title="Редактировать">✏️</button>
                  <button onClick={() => handleDelete(project.id)} title="Удалить">🗑️</button>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectList;
