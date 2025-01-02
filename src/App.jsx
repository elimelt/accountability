import './App.css'
import Dashboard from './components/Dashboard/Dashboard'
import Welcome from './components/Welcome/Welcome'

import Layout from './Layout'
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom'
function App () {

  return (
    <Layout>
      <HashRouter>
        <Routes>
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </HashRouter>
    </Layout>
  )
}

export default App
