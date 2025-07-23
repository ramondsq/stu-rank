import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Ranking from './components/Ranking'
import './App.css'

const AppContent: React.FC = () => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    )
  }

  // 只在主页显示管理后台按钮
  const showManagementButton = location.pathname === '/'

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Ranking />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/login" />} 
        />
      </Routes>
      
      {/* 浮动管理后台按钮 - 只在主页显示 */}
      {showManagementButton && (
        <div className="floating-login">
          <a href={user ? "/dashboard" : "/login"} className="login-link">
            管理后台
          </a>
        </div>
      )}
    </div>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
