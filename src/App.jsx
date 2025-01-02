import './App.css'

import Layout from './Layout'
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom'
import IDEPage from './components/IDEPage/IDEPage'
function App () {

  return (
    <Layout>
      <HashRouter>
        <Routes>
          <Route path="/" element={<IDEPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </Layout>
  )
}

export default App
