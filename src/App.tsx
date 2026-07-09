import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './store/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import GrainsPage from './pages/GrainsPage'
import WarehousesPage from './pages/WarehousesPage'
import MovementsPage from './pages/MovementsPage'
import StockPage from './pages/StockPage'
import SuppliersPage from './pages/SuppliersPage'
import ClientsPage from './pages/ClientsPage'
import Layout from './components/Layout'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/grains" element={<GrainsPage />} />
                <Route path="/warehouses" element={<WarehousesPage />} />
                <Route path="/movements" element={<MovementsPage />} />
                <Route path="/stock" element={<StockPage />} />
                <Route path="/suppliers" element={<SuppliersPage />} />
                <Route path="/clients" element={<ClientsPage />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App
