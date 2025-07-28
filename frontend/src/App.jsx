// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectList from './pages/ProjectList';
import ProjectPage from './pages/ProjectPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectList />} />
        <Route path="/project/:id" element={<ProjectPage />} />
      </Routes>
    </Router>
  );
}

export default App;
