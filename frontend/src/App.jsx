import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  const [loading, setLoading] = useState(false);
  return (
    <Router>
      {loading && <LoadingScreen />}
      <Routes>
        <Route path="/" element={<HomePage loading={loading} setLoading={setLoading} />} />
        <Route path="/dashboard" element={<DashboardPage loading={loading} setLoading={setLoading} />} />
      </Routes>
    </Router>
  )
} 
