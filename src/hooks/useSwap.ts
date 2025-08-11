import { useCallback } from 'react'
import { SwapKitApi, AssetValue, FeeOption } from '@swapkit/sdk'
import { useSwapKit } from '../providers/SwapKitProvider'
import { useSwapStore } from '../stores/swapStore'
import { useWalletStore } from '../stores/walletStore'
import type { SwapQuote } from '../stores/swapStore'
import toast from 'react-hot-toast'

export const useSwap = () => {
  const { swapKit } = useSwapKit()
  const { connectedWallets } = useWalletStore()
  const {
    sellAsset,
    buyAsset,
    sellAmount,
    sellChain,
    buyChain,
    slippage,
    setQuotes,
    setSelectedQuote,
    setLoadingQuotes,
    setQuoteError,
    setSwapping,
    setSwapTxHash,
    setSwapError,
  } = useSwapStore()

  const getQuotes = useCallback(async () => {
    if (!sellAsset || !buyAsset || !sellAmount || !sellChain || !buyChain) {
      return
    }

    const sourceWallet = connectedWallets.find(w => w.chain === sellChain)
    const destWallet = connectedWallets.find(w => w.chain === buyChain)

    if (!sourceWallet || !destWallet) {
      toast.error('Please connect wallets for both chains')
      return
    }

    setLoadingQuotes(true)
    setQuoteError(null)

    try {
      // Convert sell amount to base units
      const sellAssetValue = AssetValue.from({
        asset: sellAsset,
        value: sellAmount,
      })

      const quoteParams = {
        sellAsset,
        buyAsset,
        sellAmount: sellAssetValue.getBaseValue('string'),
        sourceAddress: sourceWallet.address,
        destinationAddress: destWallet.address,
        slippage,
      }

      const response = await SwapKitApi.getSwapQuote(quoteParams)

      if (response.success && response.data?.routes) {
        const formattedQuotes: SwapQuote[] = response.data.routes.map((route: any) => ({
          sellAsset: route.sellAsset,
          buyAsset: route.buyAsset,
          sellAmount: route.sellAmount,
          expectedBuyAmount: route.expectedBuyAmount,
          expectedBuyAmountMaxSlippage: route.expectedBuyAmountMaxSlippage,
          providers: route.providers,
          fee: route.fee,
          estimatedTime: route.estimatedTime,
          memo: route.memo,
          targetAddress: route.targetAddress,
          expiration: route.expiration,
        }))

        setQuotes(formattedQuotes)
        if (formattedQuotes.length > 0) {
          setSelectedQuote(formattedQuotes[0]) // Select best quote by default
        }
      } else {
        throw new Error(response.error || 'No routes found')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get quotes'
      setQuoteError(message)
      toast.error(`Quote error: ${message}`)
    } finally {
      setLoadingQuotes(false)
    }
  }, [
    sellAsset,
    buyAsset,
    sellAmount,
    sellChain,
    buyChain,
    slippage,
    connectedWallets,
    setQuotes,
    setSelectedQuote,
    setLoadingQuotes,
    setQuoteError,
  ])

  const executeSwap = useCallback(async (quote: SwapQuote) => {
    if (!swapKit || !quote) {
      toast.error('SwapKit not initialized or no quote selected')
      return
    }

    setSwapping(true)
    setSwapError(null)
    setSwapTxHash(null)

    try {
      // Check if token approval is needed
      const sellAssetValue = AssetValue.from({
        asset: quote.sellAsset,
        value: quote.sellAmount,
        fromBaseDecimal: true,
      })

      if (!sellAssetValue.isGasAsset && quote.targetAddress) {
        const isApproved = await swapKit.isAssetValueApproved(
          sellAssetValue,
          quote.targetAddress
        )

        if (!isApproved) {
          toast.loading('Approving tokens...', { id: 'approval' })
          await swapKit.approveAssetValue(sellAssetValue, quote.targetAddress)
          toast.success('Tokens approved!', { id: 'approval' })
        }
      }

      // Execute the swap
      toast.loading('Executing swap...', { id: 'swap' })
      const txHash = await swapKit.swap({
        route: quote,
        feeOptionKey: FeeOption.Fast,
      })

      setSwapTxHash(txHash)
      toast.success(`Swap successful! TX: ${txHash.slice(0, 10)}...`, { id: 'swap' })

      // Get explorer URL if possible
      try {
        const explorerUrl = swapKit.getExplorerTxUrl({
          chain: sellChain!,
          txHash,
        })
        console.log('Transaction URL:', explorerUrl)
      } catch (error) {
        console.warn('Failed to get explorer URL:', error)
      }

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Swap failed'
      setSwapError(message)
      toast.error(`Swap failed: ${message}`, { id: 'swap' })
    } finally {
      setSwapping(false)
    }
  }, [swapKit, sellChain, setSwapping, setSwapError, setSwapTxHash])

  const estimateGas = useCallback(async (quote: SwapQuote) => {
    if (!swapKit || !quote) return null

    try {
      const sellAssetValue = AssetValue.from({
        asset: quote.sellAsset,
        value: quote.sellAmount,
        fromBaseDecimal: true,
      })

      const fee = await swapKit.estimateTransactionFee({
        type: 'swap',
        feeOptionKey: FeeOption.Fast,
        params: {
          route: quote,
          assetValue: sellAssetValue,
        },
      })

      return fee
    } catch (error) {
      console.warn('Failed to estimate gas:', error)
      return null
    }
  }, [swapKit])

  return {
    getQuotes,
    executeSwap,
    estimateGas,
  }
}