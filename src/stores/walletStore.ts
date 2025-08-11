import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Chain, AssetValue } from '@swapkit/sdk'

export interface ConnectedWallet {
  chain: Chain
  address: string
  walletType: string
  balance?: AssetValue[]
}

interface WalletState {
  connectedWallets: ConnectedWallet[]
  isConnecting: boolean
  selectedChain: Chain | null
  
  // Actions
  addWallet: (wallet: ConnectedWallet) => void
  removeWallet: (chain: Chain) => void
  updateWalletBalance: (chain: Chain, balance: AssetValue[]) => void
  setConnecting: (connecting: boolean) => void
  setSelectedChain: (chain: Chain | null) => void
  clearWallets: () => void
  getWalletByChain: (chain: Chain) => ConnectedWallet | undefined
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      connectedWallets: [],
      isConnecting: false,
      selectedChain: null,

      addWallet: (wallet) => {
        set((state) => {
          const existingIndex = state.connectedWallets.findIndex(w => w.chain === wallet.chain)
          if (existingIndex >= 0) {
            // Update existing wallet
            const updated = [...state.connectedWallets]
            updated[existingIndex] = wallet
            return { connectedWallets: updated }
          } else {
            // Add new wallet
            return { connectedWallets: [...state.connectedWallets, wallet] }
          }
        })
      },

      removeWallet: (chain) => {
        set((state) => ({
          connectedWallets: state.connectedWallets.filter(w => w.chain !== chain)
        }))
      },

      updateWalletBalance: (chain, balance) => {
        set((state) => ({
          connectedWallets: state.connectedWallets.map(wallet =>
            wallet.chain === chain ? { ...wallet, balance } : wallet
          )
        }))
      },

      setConnecting: (connecting) => {
        set({ isConnecting: connecting })
      },

      setSelectedChain: (chain) => {
        set({ selectedChain: chain })
      },

      clearWallets: () => {
        set({ connectedWallets: [], selectedChain: null })
      },

      getWalletByChain: (chain) => {
        return get().connectedWallets.find(w => w.chain === chain)
      },
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        connectedWallets: state.connectedWallets.map(wallet => ({
          ...wallet,
          balance: undefined, // Don't persist balances
        })),
      }),
    }
  )
)