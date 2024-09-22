import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';

function App() {
  return (
    <Router >
      <main style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/:id" element={<Home />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
