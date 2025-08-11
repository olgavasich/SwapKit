import { useEffect, useCallback } from 'react'
import { SwapKitApi } from '@swapkit/sdk'
import { useTokenStore } from '../stores/tokenStore'
import type { Token } from '../stores/tokenStore'
import toast from 'react-hot-toast'

const SUPPORTED_PROVIDERS = [
  'UNISWAP_V2',
  'UNISWAP_V3', 
  'SUSHISWAP',
  'PANCAKESWAP',
  'THORCHAIN',
  'CHAINFLIP',
]

export const useTokens = () => {
  const {
    tokens,
    isLoadingTokens,
    tokenError,
    setTokens,
    addTokens,
    setLoadingTokens,
    setTokenError,
    getTokensByChain,
    getTokenByIdentifier,
    searchTokens,
  } = useTokenStore()

  const loadTokens = useCallback(async () => {
    setLoadingTokens(true)
    setTokenError(null)

    try {
      const allTokens: Token[] = []

      // Load tokens from multiple providers
      for (const provider of SUPPORTED_PROVIDERS) {
        try {
          const tokenList = await SwapKitApi.getTokenList(provider)
          
          if (tokenList && Array.isArray(tokenList.tokens)) {
            const formattedTokens: Token[] = tokenList.tokens.map((token: any) => ({
              chain: token.chain,
              symbol: token.symbol,
              ticker: token.ticker || token.symbol,
              identifier: token.identifier,
              address: token.address,
              decimals: token.decimals,
              logoURL: token.logoURL,
              name: token.name,
            }))
            
            allTokens.push(...formattedTokens)
          }
        } catch (error) {
          console.warn(`Failed to load tokens from ${provider}:`, error)
        }
      }

      // Remove duplicates based on identifier
      const uniqueTokens = allTokens.reduce((acc: Token[], token) => {
        if (!acc.find(t => t.identifier === token.identifier)) {
          acc.push(token)
        }
        return acc
      }, [])

      setTokens(uniqueTokens)
      console.log(`Loaded ${uniqueTokens.length} unique tokens`)
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load tokens'
      setTokenError(message)
      toast.error(`Failed to load tokens: ${message}`)
    } finally {
      setLoadingTokens(false)
    }
  }, [setTokens, setLoadingTokens, setTokenError])

  const loadTokenPrices = useCallback(async (tokenIdentifiers: string[]) => {
    if (tokenIdentifiers.length === 0) return {}

    try {
      const priceData = await SwapKitApi.getPrice({
        tokens: tokenIdentifiers.map(id => ({ identifier: id })),
        metadata: false
      })

      // Convert array response to a map
      const prices = priceData.reduce((acc: Record<string, number>, item: any) => {
        if (item.identifier && item.price_usd) {
          acc[item.identifier] = item.price_usd
        }
        return acc
      }, {})

      return prices
    } catch (error) {
      console.warn('Failed to load token prices:', error)
      return {}
    }
  }, [])

  const getTokenLogo = useCallback((identifier: string) => {
    return SwapKitApi.getLogoForAsset(identifier)
  }, [])

  const getChainLogo = useCallback((identifier: string) => {
    return SwapKitApi.getChainLogoForAsset(identifier)
  }, [])

  // Load tokens on mount
  useEffect(() => {
    if (tokens.length === 0 && !isLoadingTokens) {
      loadTokens()
    }
  }, [tokens.length, isLoadingTokens, loadTokens])

  return {
    tokens,
    isLoadingTokens,
    tokenError,
    loadTokens,
    loadTokenPrices,
    getTokensByChain,
    getTokenByIdentifier,
    searchTokens,
    getTokenLogo,
    getChainLogo,
  }
}