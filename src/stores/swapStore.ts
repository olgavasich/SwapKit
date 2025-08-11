import { create } from 'zustand'
import type { Chain, AssetValue } from '@swapkit/sdk'

export interface SwapQuote {
  sellAsset: string
  buyAsset: string
  sellAmount: string
  expectedBuyAmount: string
  expectedBuyAmountMaxSlippage: string
  providers: string[]
  fee: {
    asset: string
    networkFee: string
    affiliateFee?: string
    totalFee: string
  }
  estimatedTime?: {
    inbound: number
    outbound: number
    total: number
  }
  memo?: string
  targetAddress?: string
  expiration?: string
}

interface SwapState {
  // Swap form state
  sellAsset: string | null
  buyAsset: string | null
  sellAmount: string
  sellChain: Chain | null
  buyChain: Chain | null
  slippage: number
  
  // Quote state
  quotes: SwapQuote[]
  selectedQuote: SwapQuote | null
  isLoadingQuotes: boolean
  quoteError: string | null
  
  // Transaction state
  isSwapping: boolean
  swapTxHash: string | null
  swapError: string | null
  
  // Actions
  setSellAsset: (asset: string | null) => void
  setBuyAsset: (asset: string | null) => void
  setSellAmount: (amount: string) => void
  setSellChain: (chain: Chain | null) => void
  setBuyChain: (chain: Chain | null) => void
  setSlippage: (slippage: number) => void
  setQuotes: (quotes: SwapQuote[]) => void
  setSelectedQuote: (quote: SwapQuote | null) => void
  setLoadingQuotes: (loading: boolean) => void
  setQuoteError: (error: string | null) => void
  setSwapping: (swapping: boolean) => void
  setSwapTxHash: (txHash: string | null) => void
  setSwapError: (error: string | null) => void
  resetSwap: () => void
  swapAssets: () => void
}

export const useSwapStore = create<SwapState>((set, get) => ({
  // Initial state
  sellAsset: null,
  buyAsset: null,
  sellAmount: '',
  sellChain: null,
  buyChain: null,
  slippage: 3, // 3% default slippage
  
  quotes: [],
  selectedQuote: null,
  isLoadingQuotes: false,
  quoteError: null,
  
  isSwapping: false,
  swapTxHash: null,
  swapError: null,
  
  // Actions
  setSellAsset: (asset) => set({ sellAsset: asset }),
  setBuyAsset: (asset) => set({ buyAsset: asset }),
  setSellAmount: (amount) => set({ sellAmount: amount }),
  setSellChain: (chain) => set({ sellChain: chain }),
  setBuyChain: (chain) => set({ buyChain: chain }),
  setSlippage: (slippage) => set({ slippage }),
  setQuotes: (quotes) => set({ quotes }),
  setSelectedQuote: (quote) => set({ selectedQuote: quote }),
  setLoadingQuotes: (loading) => set({ isLoadingQuotes: loading }),
  setQuoteError: (error) => set({ quoteError: error }),
  setSwapping: (swapping) => set({ isSwapping: swapping }),
  setSwapTxHash: (txHash) => set({ swapTxHash: txHash }),
  setSwapError: (error) => set({ swapError: error }),
  
  resetSwap: () => set({
    quotes: [],
    selectedQuote: null,
    isLoadingQuotes: false,
    quoteError: null,
    isSwapping: false,
    swapTxHash: null,
    swapError: null,
  }),
  
  swapAssets: () => {
    const { sellAsset, buyAsset, sellChain, buyChain } = get()
    set({
      sellAsset: buyAsset,
      buyAsset: sellAsset,
      sellChain: buyChain,
      buyChain: sellChain,
      sellAmount: '',
      quotes: [],
      selectedQuote: null,
    })
  },
}))