import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import Login from './components/auth/Login'
import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <Container component="main" sx={{ flex: 1, mt: 2, pb: 5 }}>
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Container>
      <Footer />
    </Box>
  )
}

export default App