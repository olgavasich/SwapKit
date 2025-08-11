import React, { useState } from 'react'
import { X, Wallet, HardDrive, Smartphone, Usb } from 'lucide-react'
import { Chain, WalletOption } from '@swapkit/sdk'
import { useWalletConnection } from '../hooks/useWalletConnection'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

const SUPPORTED_CHAINS = [
  { chain: Chain.Ethereum, name: 'Ethereum', symbol: 'ETH' },
  { chain: Chain.Bitcoin, name: 'Bitcoin', symbol: 'BTC' },
  { chain: Chain.BinanceSmartChain, name: 'BSC', symbol: 'BNB' },
  { chain: Chain.Avalanche, name: 'Avalanche', symbol: 'AVAX' },
  { chain: Chain.Polygon, name: 'Polygon', symbol: 'MATIC' },
  { chain: Chain.Arbitrum, name: 'Arbitrum', symbol: 'ARB' },
  { chain: Chain.Optimism, name: 'Optimism', symbol: 'OP' },
  { chain: Chain.Cosmos, name: 'Cosmos', symbol: 'ATOM' },
  { chain: Chain.THORChain, name: 'THORChain', symbol: 'RUNE' },
  { chain: Chain.Solana, name: 'Solana', symbol: 'SOL' },
  { chain: Chain.Ripple, name: 'Ripple', symbol: 'XRP' },
]

const EVM_CHAINS = [
  Chain.Ethereum,
  Chain.BinanceSmartChain,
  Chain.Avalanche,
  Chain.Polygon,
  Chain.Arbitrum,
  Chain.Optimism,
]

const COSMOS_CHAINS = [
  Chain.Cosmos,
  Chain.THORChain,
]

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const [selectedChains, setSelectedChains] = useState<Chain[]>([])
  const [keystorePhrase, setKeystorePhrase] = useState('')
  const [activeTab, setActiveTab] = useState<'browser' | 'keystore' | 'hardware'>('browser')

  const {
    connectKeystore,
    connectEVMWallet,
    connectKeplr,
    connectCosmostation,
    connectLedger,
  } = useWalletConnection()

  if (!isOpen) return null

  const handleChainToggle = (chain: Chain) => {
    setSelectedChains(prev =>
      prev.includes(chain)
        ? prev.filter(c => c !== chain)
        : [...prev, chain]
    )
  }

  const handleKeystoreConnect = async () => {
    if (!keystorePhrase.trim() || selectedChains.length === 0) return
    
    const success = await connectKeystore(selectedChains, keystorePhrase.trim())
    if (success) {
      onClose()
      setKeystorePhrase('')
      setSelectedChains([])
    }
  }

  const handleEVMConnect = async (walletOption?: WalletOption) => {
    const evmChains = selectedChains.filter(chain => EVM_CHAINS.includes(chain))
    if (evmChains.length === 0) return

    const success = await connectEVMWallet(evmChains, walletOption)
    if (success) {
      onClose()
      setSelectedChains([])
    }
  }

  const handleCosmosConnect = async (type: 'keplr' | 'cosmostation') => {
    const cosmosChains = selectedChains.filter(chain => COSMOS_CHAINS.includes(chain))
    if (cosmosChains.length === 0) return

    const success = type === 'keplr' 
      ? await connectKeplr(cosmosChains)
      : await connectCosmostation(cosmosChains)
    
    if (success) {
      onClose()
      setSelectedChains([])
    }
  }

  const handleLedgerConnect = async () => {
    if (selectedChains.length === 0) return
    
    const success = await connectLedger(selectedChains)
    if (success) {
      onClose()
      setSelectedChains([])
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {[
            { id: 'browser', label: 'Browser Wallets', icon: Smartphone },
            { id: 'keystore', label: 'Keystore', icon: HardDrive },
            { id: 'hardware', label: 'Hardware', icon: Usb },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-400 border-b-2 border-primary-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div className="p-6">
          {/* Chain Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-4">Select Chains</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SUPPORTED_CHAINS.map(({ chain, name, symbol }) => (
                <button
                  key={chain}
                  onClick={() => handleChainToggle(chain)}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedChains.includes(chain)
                      ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                      : 'border-gray-600 hover:border-gray-500 text-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">{name}</div>
                  <div className="text-xs opacity-75">{symbol}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Wallet Options */}
          {activeTab === 'browser' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Browser Wallets</h3>
              
              {/* EVM Wallets */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400">EVM Chains</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleEVMConnect(WalletOption.METAMASK)}
                    disabled={!selectedChains.some(c => EVM_CHAINS.includes(c))}
                    className="flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Wallet className="w-5 h-5" />
                    <span>MetaMask</span>
                  </button>
                  <button
                    onClick={() => handleEVMConnect(WalletOption.COINBASE)}
                    disabled={!selectedChains.some(c => EVM_CHAINS.includes(c))}
                    className="flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Wallet className="w-5 h-5" />
                    <span>Coinbase Wallet</span>
                  </button>
                </div>
              </div>

              {/* Cosmos Wallets */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400">Cosmos Chains</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleCosmosConnect('keplr')}
                    disabled={!selectedChains.some(c => COSMOS_CHAINS.includes(c))}
                    className="flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Wallet className="w-5 h-5" />
                    <span>Keplr</span>
                  </button>
                  <button
                    onClick={() => handleCosmosConnect('cosmostation')}
                    disabled={!selectedChains.some(c => COSMOS_CHAINS.includes(c))}
                    className="flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Wallet className="w-5 h-5" />
                    <span>Cosmostation</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'keystore' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Keystore Wallet</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mnemonic Phrase
                  </label>
                  <textarea
                    value={keystorePhrase}
                    onChange={(e) => setKeystorePhrase(e.target.value)}
                    placeholder="Enter your 12 or 24 word mnemonic phrase..."
                    className="w-full h-24 input resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Your mnemonic phrase is never stored and only used locally to derive wallet addresses.
                  </p>
                </div>
                <button
                  onClick={handleKeystoreConnect}
                  disabled={!keystorePhrase.trim() || selectedChains.length === 0}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Connect Keystore
                </button>
              </div>
            </div>
          )}

          {activeTab === 'hardware' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Hardware Wallets</h3>
              <div className="space-y-3">
                <button
                  onClick={handleLedgerConnect}
                  disabled={selectedChains.length === 0}
                  className="w-full flex items-center space-x-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Usb className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Ledger</div>
                    <div className="text-sm text-gray-400">Connect via USB or Bluetooth</div>
                  </div>
                </button>
                <div className="text-sm text-gray-400 p-3 bg-gray-700/50 rounded-lg">
                  <p>Make sure your Ledger device is connected and the appropriate app is open.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WalletModal