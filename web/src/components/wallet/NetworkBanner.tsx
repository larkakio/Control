'use client'

import { base } from 'wagmi/chains'
import { useAccount, useSwitchChain } from 'wagmi'

const TARGET = base.id

export function NetworkBanner() {
  const { isConnected, chainId } = useAccount()
  const { switchChain, isPending } = useSwitchChain()

  if (!isConnected || chainId === TARGET) return null

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-500/50 bg-amber-950/50 px-3 py-2 text-sm text-amber-100"
      role="status"
    >
      <span>Wrong network — switch to Base for check-in.</span>
      <button
        type="button"
        disabled={isPending}
        onClick={() => switchChain({ chainId: TARGET })}
        className="rounded border border-amber-400/70 px-2 py-1 text-xs font-medium hover:bg-amber-500/20"
      >
        {isPending ? 'Switching…' : 'Switch to Base'}
      </button>
    </div>
  )
}
