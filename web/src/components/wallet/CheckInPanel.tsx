'use client'

import { useCallback, useMemo, useState } from 'react'
import { isAddress, type Hex } from 'viem'
import { base } from 'wagmi/chains'
import {
  useAccount,
  useReadContract,
  useSwitchChain,
  useWriteContract,
} from 'wagmi'

import { getCheckInDataSuffix } from '@/lib/builder-suffix'
import { checkInAbi } from '@/lib/check-in-abi'

/** Check-in always targets Base mainnet (8453). */
const TARGET_CHAIN = base.id

function currentDayIndex(): bigint {
  const sec = BigInt(Math.floor(Date.now() / 1000))
  return sec / BigInt(86400)
}

export function CheckInPanel() {
  const { address, isConnected, chainId } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const { writeContractAsync, isPending: isWriting } = useWriteContract()
  const [error, setError] = useState<string | null>(null)

  const rawAddr = process.env.NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS
  const contractAddress = useMemo(() => {
    if (!rawAddr || !isAddress(rawAddr)) return undefined
    return rawAddr as `0x${string}`
  }, [rawAddr])

  const { data: lastDay, refetch } = useReadContract({
    address: contractAddress,
    abi: checkInAbi,
    functionName: 'lastCheckInDay',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(contractAddress && address) },
  })

  const alreadyToday = useMemo(() => {
    if (lastDay === undefined) return false
    return BigInt(String(lastDay)) === currentDayIndex()
  }, [lastDay])

  const onCheckIn = useCallback(async () => {
    setError(null)
    if (!address || !contractAddress) {
      setError('Contract address not configured.')
      return
    }
    try {
      if (chainId !== TARGET_CHAIN) {
        await switchChainAsync({ chainId: TARGET_CHAIN })
      }
      const suffix = getCheckInDataSuffix() as Hex | undefined
      await writeContractAsync({
        address: contractAddress,
        abi: checkInAbi,
        functionName: 'checkIn',
        chainId: TARGET_CHAIN,
        ...(suffix ? { dataSuffix: suffix } : {}),
      })
      await refetch()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Transaction failed'
      setError(msg)
    }
  }, [
    address,
    chainId,
    contractAddress,
    refetch,
    switchChainAsync,
    writeContractAsync,
  ])

  if (!isConnected) {
    return (
      <p className="text-xs text-zinc-500">
        Connect a wallet to submit a daily on-chain check-in on Base.
      </p>
    )
  }

  if (!contractAddress) {
    return (
      <p className="text-xs text-amber-600/90">
        Set NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS after deploying the contract.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-violet-500/30 bg-violet-950/20 p-3">
      <div className="text-xs text-zinc-400">
        {alreadyToday ? (
          <span className="text-emerald-400/90">Checked in today.</span>
        ) : (
          <span>Daily check-in (Base mainnet, gas only).</span>
        )}
      </div>
      <button
        type="button"
        disabled={isWriting || alreadyToday}
        onClick={onCheckIn}
        className="rounded border border-violet-400/50 bg-violet-600/20 py-2 text-sm font-medium text-violet-100 hover:bg-violet-500/25 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isWriting ? 'Confirm in wallet…' : alreadyToday ? 'Already checked in' : 'Check in on-chain'}
      </button>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  )
}
