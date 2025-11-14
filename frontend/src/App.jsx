import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Results from './pages/Results'
import Contact from './pages/Contact'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">FinClassify</Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/upload" className="nav-link">Upload</Link>
              <Link to="/results" className="nav-link">Results</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/results" element={<Results />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
