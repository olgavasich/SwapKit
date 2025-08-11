import React, { useState, useEffect } from 'react'
import { Clock, ExternalLink, Filter, Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useWalletStore } from '../stores/walletStore'

interface Transaction {
  id: string
  hash: string
  chain: string
  type: 'swap' | 'transfer' | 'approve'
  status: 'pending' | 'completed' | 'failed'
  timestamp: number
  from: string
  to?: string
  amount: string
  symbol: string
  fee?: string
  explorerUrl?: string
}

const TransactionsPage: React.FC = () => {
  const { connectedWallets } = useWalletStore()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'swap' | 'transfer' | 'approve'>('all')
  const [isLoading, setIsLoading] = useState(false)

  // Mock transaction data - in a real app, this would come from transaction history API
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        hash: '0x1234567890abcdef1234567890abcdef12345678',
        chain: 'ETH',
        type: 'swap',
        status: 'completed',
        timestamp: Date.now() - 3600000, // 1 hour ago
        from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        amount: '0.1',
        symbol: 'ETH',
        fee: '0.002',
        explorerUrl: 'https://etherscan.io/tx/0x1234567890abcdef1234567890abcdef12345678',
      },
      {
        id: '2',
        hash: '0xabcdef1234567890abcdef1234567890abcdef12',
        chain: 'BTC',
        type: 'transfer',
        status: 'pending',
        timestamp: Date.now() - 1800000, // 30 minutes ago
        from: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        to: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
        amount: '0.001',
        symbol: 'BTC',
        fee: '0.00001',
        explorerUrl: 'https://blockstream.info/tx/0xabcdef1234567890abcdef1234567890abcdef12',
      },
      {
        id: '3',
        hash: '0xfedcba0987654321fedcba0987654321fedcba09',
        chain: 'AVAX',
        type: 'approve',
        status: 'failed',
        timestamp: Date.now() - 7200000, // 2 hours ago
        from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        amount: '1000',
        symbol: 'USDC',
        fee: '0.01',
        explorerUrl: 'https://snowtrace.io/tx/0xfedcba0987654321fedcba0987654321fedcba09',
      },
    ]

    setTransactions(mockTransactions)
  }, [])

  // Filter transactions based on search and filters
  useEffect(() => {
    let filtered = transactions

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(tx =>
        tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.chain.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter)
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(tx => tx.type === typeFilter)
    }

    // Filter by connected wallets
    if (connectedWallets.length > 0) {
      const connectedAddresses = connectedWallets.map(w => w.address.toLowerCase())
      filtered = filtered.filter(tx =>
        connectedAddresses.includes(tx.from.toLowerCase()) ||
        (tx.to && connectedAddresses.includes(tx.to.toLowerCase()))
      )
    }

    setFilteredTransactions(filtered)
  }, [transactions, searchQuery, statusFilter, typeFilter, connectedWallets])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
    }
  }

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-400'
      case 'failed':
        return 'text-red-400'
      case 'pending':
        return 'text-yellow-400'
    }
  }

  const getTypeLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'swap':
        return 'Swap'
      case 'transfer':
        return 'Transfer'
      case 'approve':
        return 'Approve'
    }
  }

  if (connectedWallets.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">No Transaction History</h2>
        <p className="text-gray-400 mb-6">Connect your wallets to view transaction history</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Transactions</h1>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            <option value="swap">Swaps</option>
            <option value="transfer">Transfers</option>
            <option value="approve">Approvals</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No Transactions Found</h2>
          <p className="text-gray-400">
            {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Your transaction history will appear here'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="card">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {getStatusIcon(tx.status)}
                    </div>

                    {/* Transaction Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-white">{getTypeLabel(tx.type)}</span>
                        <span className="text-xs bg-gray-600 px-2 py-1 rounded">{tx.chain}</span>
                        <span className={`text-sm font-medium ${getStatusColor(tx.status)}`}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-400 space-y-1">
                        <div>
                          {tx.amount} {tx.symbol}
                          {tx.fee && ` • Fee: ${tx.fee} ${tx.chain === 'ETH' ? 'ETH' : tx.chain}`}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>From: {formatAddress(tx.from)}</span>
                          {tx.to && (
                            <>
                              <span>→</span>
                              <span>To: {formatAddress(tx.to)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Time and Actions */}
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm text-gray-400">{formatTime(tx.timestamp)}</div>
                      <div className="text-xs text-gray-500">{formatAddress(tx.hash)}</div>
                    </div>
                    
                    {tx.explorerUrl && (
                      <a
                        href={tx.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
                        title="View in Explorer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {filteredTransactions.length > 0 && (
        <div className="text-center">
          <button
            onClick={() => {
              // In a real app, this would load more transactions
              console.log('Load more transactions')
            }}
            className="btn-outline"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

export default TransactionsPage