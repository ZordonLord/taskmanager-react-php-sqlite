// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectList from './pages/ProjectList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectList />} />
      </Routes>
    </Router>
  );
}

export default App;
