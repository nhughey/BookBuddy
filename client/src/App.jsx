// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Books from './pages/Books';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <nav style={{ 
          padding: '1rem', 
          backgroundColor: '#333', 
          color: 'white',
          marginBottom: '20px' 
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Site Logo/Home Link */}
            <a href="/" style={{ color: 'white', textDecoration: 'none' }}>BookBuddy</a>
            
            {/* Auth Navigation Links */}
            <div>
              <a href="/login" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Login</a>
              <a href="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</a>
            </div>
          </div>
        </nav>

        {/* Route Configuration */}
        <Routes>
          <Route path="/" element={<Books />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;