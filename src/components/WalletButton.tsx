import React, { useState } from 'react'
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink } from 'lucide-react'
import { useWalletStore } from '../stores/walletStore'
import { useWalletConnection } from '../hooks/useWalletConnection'
import WalletModal from './WalletModal'
import toast from 'react-hot-toast'

const WalletButton: React.FC = () => {
  const { connectedWallets, isConnecting } = useWalletStore()
  const { disconnectAll } = useWalletConnection()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const hasConnectedWallets = connectedWallets.length > 0

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast.success('Address copied to clipboard')
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (hasConnectedWallets) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">
            {connectedWallets.length} Wallet{connectedWallets.length !== 1 ? 's' : ''}
          </span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Connected Wallets</h3>
                  <button
                    onClick={() => {
                      disconnectAll()
                      setIsDropdownOpen(false)
                    }}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Disconnect All"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {connectedWallets.map((wallet) => (
                    <div
                      key={`${wallet.chain}-${wallet.address}`}
                      className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-white">
                            {wallet.chain}
                          </span>
                          <span className="text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded">
                            {wallet.walletType}
                          </span>
                        </div>
                        <div className="text-sm text-gray-300 mt-1">
                          {formatAddress(wallet.address)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyAddress(wallet.address)}
                          className="text-gray-400 hover:text-white p-1"
                          title="Copy Address"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            // Open explorer - this would need chain-specific logic
                            console.log('Open explorer for', wallet.chain, wallet.address)
                          }}
                          className="text-gray-400 hover:text-white p-1"
                          title="View in Explorer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setIsModalOpen(true)
                    setIsDropdownOpen(false)
                  }}
                  className="w-full mt-4 btn-outline"
                >
                  Connect More Wallets
                </button>
              </div>
            </div>
          </>
        )}

        <WalletModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isConnecting}
        className="flex items-center space-x-2 btn-primary disabled:opacity-50"
      >
        <Wallet className="w-4 h-4" />
        <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>

      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default WalletButton