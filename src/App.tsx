import { Routes, Route } from 'react-router-dom'
import { SwapKitProvider } from './providers/SwapKitProvider'
import Layout from './components/Layout'
import SwapPage from './pages/SwapPage'
import PortfolioPage from './pages/PortfolioPage'
import TransactionsPage from './pages/TransactionsPage'

function App() {
  return (
    <SwapKitProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<SwapPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Routes>
      </Layout>
    </SwapKitProvider>
  )
}

export default App