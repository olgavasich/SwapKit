import React, { createContext, useContext, useEffect, useState } from 'react'
import { createSwapKit, SKConfig } from '@swapkit/sdk'
import type { SwapKit } from '@swapkit/sdk'
import toast from 'react-hot-toast'

interface SwapKitContextType {
  swapKit: SwapKit | null
  isInitialized: boolean
  error: string | null
}

const SwapKitContext = createContext<SwapKitContextType>({
  swapKit: null,
  isInitialized: false,
  error: null,
})

export const useSwapKit = () => {
  const context = useContext(SwapKitContext)
  if (!context) {
    throw new Error('useSwapKit must be used within SwapKitProvider')
  }
  return context
}

interface SwapKitProviderProps {
  children: React.ReactNode
}

export const SwapKitProvider: React.FC<SwapKitProviderProps> = ({ children }) => {
  const [swapKit, setSwapKit] = useState<SwapKit | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeSwapKit = async () => {
      try {
        // Configure SwapKit with environment variables if available
        const config = {
          apiKeys: {
            swapKit: import.meta.env.VITE_SWAPKIT_API_KEY || '',
            walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
            blockchair: import.meta.env.VITE_BLOCKCHAIR_API_KEY || '',
          },
          rpcUrls: {
            ETH: import.meta.env.VITE_ETH_RPC_URL || 'https://eth.llamarpc.com',
            AVAX: import.meta.env.VITE_AVAX_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc',
            BSC: import.meta.env.VITE_BSC_RPC_URL || 'https://bsc-dataseed.binance.org',
            MATIC: import.meta.env.VITE_POLYGON_RPC_URL || 'https://polygon-rpc.com',
          },
          envs: {
            isDev: import.meta.env.DEV,
            isStagenet: import.meta.env.VITE_USE_TESTNET === 'true',
          },
        }

        // Set configuration
        SKConfig.set(config)

        // Create SwapKit instance
        const swapKitInstance = createSwapKit({ config })
        
        setSwapKit(swapKitInstance)
        setIsInitialized(true)
        
        console.log('SwapKit initialized successfully')
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize SwapKit'
        setError(errorMessage)
        toast.error(`SwapKit initialization failed: ${errorMessage}`)
        console.error('SwapKit initialization error:', err)
      }
    }

    initializeSwapKit()
  }, [])

  return (
    <SwapKitContext.Provider value={{ swapKit, isInitialized, error }}>
      {children}
    </SwapKitContext.Provider>
  )
}