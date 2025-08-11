import { create } from 'zustand'
import type { Chain } from '@swapkit/sdk'

export interface Token {
  chain: Chain
  symbol: string
  ticker: string
  identifier: string
  address?: string
  decimals: number
  logoURL?: string
  name: string
  price?: number
}

interface TokenState {
  tokens: Token[]
  isLoadingTokens: boolean
  tokenError: string | null
  searchQuery: string
  selectedChains: Chain[]
  
  // Actions
  setTokens: (tokens: Token[]) => void
  addTokens: (tokens: Token[]) => void
  setLoadingTokens: (loading: boolean) => void
  setTokenError: (error: string | null) => void
  setSearchQuery: (query: string) => void
  setSelectedChains: (chains: Chain[]) => void
  getTokensByChain: (chain: Chain) => Token[]
  getTokenByIdentifier: (identifier: string) => Token | undefined
  searchTokens: (query: string, chains?: Chain[]) => Token[]
}

export const useTokenStore = create<TokenState>((set, get) => ({
  tokens: [],
  isLoadingTokens: false,
  tokenError: null,
  searchQuery: '',
  selectedChains: [],
  
  setTokens: (tokens) => set({ tokens }),
  
  addTokens: (newTokens) => {
    set((state) => {
      const existingIdentifiers = new Set(state.tokens.map(t => t.identifier))
      const uniqueNewTokens = newTokens.filter(t => !existingIdentifiers.has(t.identifier))
      return { tokens: [...state.tokens, ...uniqueNewTokens] }
    })
  },
  
  setLoadingTokens: (loading) => set({ isLoadingTokens: loading }),
  setTokenError: (error) => set({ tokenError: error }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedChains: (chains) => set({ selectedChains: chains }),
  
  getTokensByChain: (chain) => {
    return get().tokens.filter(token => token.chain === chain)
  },
  
  getTokenByIdentifier: (identifier) => {
    return get().tokens.find(token => token.identifier === identifier)
  },
  
  searchTokens: (query, chains) => {
    const { tokens } = get()
    const searchQuery = query.toLowerCase()
    
    return tokens.filter(token => {
      const matchesQuery = !query || 
        token.symbol.toLowerCase().includes(searchQuery) ||
        token.name.toLowerCase().includes(searchQuery) ||
        token.identifier.toLowerCase().includes(searchQuery)
      
      const matchesChain = !chains || chains.length === 0 || chains.includes(token.chain)
      
      return matchesQuery && matchesChain
    })
  },
}))