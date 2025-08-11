import { useCallback } from 'react'
import { useSwapKit } from '../providers/SwapKitProvider'
import { useWalletStore } from '../stores/walletStore'
import { Chain, WalletOption } from '@swapkit/sdk'
import toast from 'react-hot-toast'

export const useWalletConnection = () => {
  const { swapKit } = useSwapKit()
  const { addWallet, removeWallet, setConnecting, clearWallets } = useWalletStore()

  const connectKeystore = useCallback(async (chains: Chain[], phrase: string) => {
    if (!swapKit) {
      toast.error('SwapKit not initialized')
      return false
    }

    setConnecting(true)
    try {
      await swapKit.connectKeystore(chains, phrase)
      
      // Add wallets to store
      for (const chain of chains) {
        try {
          const address = swapKit.getAddress(chain)
          if (address) {
            addWallet({
              chain,
              address,
              walletType: 'keystore',
            })
          }
        } catch (error) {
          console.warn(`Failed to get address for ${chain}:`, error)
        }
      }
      
      toast.success(`Connected to ${chains.length} chain(s)`)
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect keystore'
      toast.error(message)
      return false
    } finally {
      setConnecting(false)
    }
  }, [swapKit, addWallet, setConnecting])

  const connectEVMWallet = useCallback(async (chains: Chain[], walletOption?: WalletOption) => {
    if (!swapKit) {
      toast.error('SwapKit not initialized')
      return false
    }

    setConnecting(true)
    try {
      await swapKit.connectEVMWallet(chains, walletOption)
      
      // Add wallets to store
      for (const chain of chains) {
        try {
          const address = swapKit.getAddress(chain)
          if (address) {
            addWallet({
              chain,
              address,
              walletType: walletOption || 'evm',
            })
          }
        } catch (error) {
          console.warn(`Failed to get address for ${chain}:`, error)
        }
      }
      
      toast.success(`Connected to ${chains.length} EVM chain(s)`)
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect EVM wallet'
      toast.error(message)
      return false
    } finally {
      setConnecting(false)
    }
  }, [swapKit, addWallet, setConnecting])

  const connectKeplr = useCallback(async (chains: Chain[]) => {
    if (!swapKit) {
      toast.error('SwapKit not initialized')
      return false
    }

    setConnecting(true)
    try {
      await swapKit.connectKeplr(chains)
      
      // Add wallets to store
      for (const chain of chains) {
        try {
          const address = swapKit.getAddress(chain)
          if (address) {
            addWallet({
              chain,
              address,
              walletType: 'keplr',
            })
          }
        } catch (error) {
          console.warn(`Failed to get address for ${chain}:`, error)
        }
      }
      
      toast.success(`Connected to ${chains.length} Cosmos chain(s)`)
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect Keplr'
      toast.error(message)
      return false
    } finally {
      setConnecting(false)
    }
  }, [swapKit, addWallet, setConnecting])

  const connectCosmostation = useCallback(async (chains: Chain[]) => {
    if (!swapKit) {
      toast.error('SwapKit not initialized')
      return false
    }

    setConnecting(true)
    try {
      await swapKit.connectCosmostation(chains)
      
      // Add wallets to store
      for (const chain of chains) {
        try {
          const address = swapKit.getAddress(chain)
          if (address) {
            addWallet({
              chain,
              address,
              walletType: 'cosmostation',
            })
          }
        } catch (error) {
          console.warn(`Failed to get address for ${chain}:`, error)
        }
      }
      
      toast.success(`Connected to ${chains.length} Cosmos chain(s)`)
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect Cosmostation'
      toast.error(message)
      return false
    } finally {
      setConnecting(false)
    }
  }, [swapKit, addWallet, setConnecting])

  const connectLedger = useCallback(async (chains: Chain[]) => {
    if (!swapKit) {
      toast.error('SwapKit not initialized')
      return false
    }

    setConnecting(true)
    try {
      await swapKit.connectLedger(chains)
      
      // Add wallets to store
      for (const chain of chains) {
        try {
          const address = swapKit.getAddress(chain)
          if (address) {
            addWallet({
              chain,
              address,
              walletType: 'ledger',
            })
          }
        } catch (error) {
          console.warn(`Failed to get address for ${chain}:`, error)
        }
      }
      
      toast.success(`Connected to ${chains.length} chain(s) via Ledger`)
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect Ledger'
      toast.error(message)
      return false
    } finally {
      setConnecting(false)
    }
  }, [swapKit, addWallet, setConnecting])

  const disconnectWallet = useCallback((chain: Chain) => {
    if (!swapKit) return

    try {
      swapKit.disconnectChain(chain)
      removeWallet(chain)
      toast.success(`Disconnected from ${chain}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to disconnect wallet'
      toast.error(message)
    }
  }, [swapKit, removeWallet])

  const disconnectAll = useCallback(() => {
    if (!swapKit) return

    try {
      swapKit.disconnectAll()
      clearWallets()
      toast.success('Disconnected from all wallets')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to disconnect all wallets'
      toast.error(message)
    }
  }, [swapKit, clearWallets])

  return {
    connectKeystore,
    connectEVMWallet,
    connectKeplr,
    connectCosmostation,
    connectLedger,
    disconnectWallet,
    disconnectAll,
  }
}