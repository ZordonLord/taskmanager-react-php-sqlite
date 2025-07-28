import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { createTask, updateTask, deleteTask } from '../api/tasks';
import './ProjectList.css';

function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 2, status: 'todo' });
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState({ title: '', description: '', priority: 2, status: 'todo' });

  const loadTasks = async () => {
    try {
      const tasksRes = await axios.get('/api/tasks');
      setTasks(tasksRes.data.filter(task => task.project_id == id));
    } catch {
      setError('Ошибка загрузки задач');
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      axios.get(`/api/projects/${id}`),
      axios.get('/api/tasks')
    ])
      .then(([projRes, tasksRes]) => {
        setProject(projRes.data);
        setTasks(tasksRes.data.filter(task => task.project_id == id));
      })
      .catch(() => setError('Ошибка загрузки данных'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    setAdding(true);
    try {
      await createTask({ ...newTask, project_id: parseInt(id) });
      setNewTask({ title: '', description: '', priority: 2, status: 'todo' });
      await loadTasks();
    } catch {
      setError('Ошибка при добавлении задачи');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Удалить задачу?')) return;
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch {
      setError('Ошибка при удалении задачи');
    }
  };

  const handleEditTask = (task) => {
    setEditId(task.id);
    setEditTask({ title: task.title, description: task.description, priority: task.priority, status: task.status });
  };

  const handleEditSave = async (taskId) => {
    try {
      await updateTask(taskId, { ...editTask, project_id: parseInt(id) });
      await loadTasks();
      setEditId(null);
    } catch {
      setError('Ошибка при обновлении задачи');
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!project) return <p>Проект не найден</p>;

  return (
    <div className="project-list-container">
      <h1>{project.title}</h1>
      <p className="project-description">{project.description}</p>
      <h2>Задачи проекта</h2>
      <form className="project-form" onSubmit={handleAddTask} style={{marginBottom: '2em'}}>
        <input
          type="text"
          placeholder="Название задачи"
          value={newTask.title}
          onChange={e => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Описание задачи"
          value={newTask.description}
          onChange={e => setNewTask({ ...newTask, description: e.target.value })}
        />
        <select
          value={newTask.priority}
          onChange={e => setNewTask({ ...newTask, priority: parseInt(e.target.value) })}
        >
          <option value={1}>Низкий приоритет</option>
          <option value={2}>Средний приоритет</option>
          <option value={3}>Высокий приоритет</option>
        </select>
        <select
          value={newTask.status}
          onChange={e => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="todo">К выполнению</option>
          <option value="in_progress">В работе</option>
          <option value="done">Завершено</option>
        </select>
        <button type="submit" disabled={adding}>Добавить</button>
      </form>
      {tasks.length === 0 ? (
        <p>Задач пока нет.</p>
      ) : (
        <div className="project-grid">
          {tasks.map(task => (
            editId === task.id ? (
              <div className="card project-card" key={task.id}>
                <input
                  type="text"
                  value={editTask.title}
                  onChange={e => setEditTask({ ...editTask, title: e.target.value })}
                  required
                  style={{width: '100%', marginBottom: '0.5em'}}
                />
                <input
                  type="text"
                  value={editTask.description}
                  onChange={e => setEditTask({ ...editTask, description: e.target.value })}
                  style={{width: '100%', marginBottom: '0.5em'}}
                />
                <select
                  value={editTask.priority}
                  onChange={e => setEditTask({ ...editTask, priority: parseInt(e.target.value) })}
                  style={{width: '100%', marginBottom: '0.5em'}}
                >
                  <option value={1}>Низкий приоритет</option>
                  <option value={2}>Средний приоритет</option>
                  <option value={3}>Высокий приоритет</option>
                </select>
                <select
                  value={editTask.status}
                  onChange={e => setEditTask({ ...editTask, status: e.target.value })}
                  style={{width: '100%', marginBottom: '0.5em'}}
                >
                  <option value="todo">К выполнению</option>
                  <option value="in_progress">В работе</option>
                  <option value="done">Завершено</option>
                </select>
                <button onClick={() => handleEditSave(task.id)} style={{marginRight: '0.5em'}}>Сохранить</button>
                <button onClick={handleEditCancel} type="button">Отмена</button>
              </div>
            ) : (
              <div className="card project-card" key={task.id} style={{position: 'relative'}}>
                <strong className="project-title">{task.title}</strong>
                <p className="project-description">{task.description}</p>
                <div style={{marginTop: '1em', fontSize: '0.95em'}}>
                  <span>Статус: <b>{task.status}</b></span><br/>
                  <span>Приоритет: <b>{task.priority}</b></span>
                </div>
                <div style={{position: 'absolute', top: 10, right: 10, display: 'flex', gap: '0.5em'}}>
                  <button onClick={() => handleEditTask(task)} title="Редактировать">✏️</button>
                  <button onClick={() => handleDeleteTask(task.id)} title="Удалить">🗑️</button>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectPage; 