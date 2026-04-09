'use client'

import { useMemo } from 'react'
import { useAccount, useConnect } from 'wagmi'

import { ConnectBar } from './ConnectBar'

export function WalletHeader() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()

  const primary = useMemo(
    () => connectors.find((c) => c.id === 'injected') ?? connectors[0],
    [connectors],
  )

  const short = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : null

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 bg-black/40 px-4 py-3 backdrop-blur">
      <div>
        <p className="font-[family-name:var(--font-control)] text-lg font-bold tracking-widest text-cyan-300">
          CONTROL
        </p>
        {isConnected && short && (
          <p className="font-mono text-xs text-zinc-400">{short}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {!isConnected && primary ? (
          <button
            type="button"
            disabled={isPending}
            onClick={() => connect({ connector: primary })}
            className="rounded border border-cyan-400/60 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
          >
            {isPending ? 'Connecting…' : 'Connect wallet'}
          </button>
        ) : null}
        <ConnectBar />
      </div>
    </header>
  )
}
