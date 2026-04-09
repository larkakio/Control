'use client'

import { useMemo, useState } from 'react'
import { useConnect, useConnectors, useDisconnect } from 'wagmi'

export function ConnectBar() {
  const connectors = useConnectors()
  const { connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [open, setOpen] = useState(false)

  const list = useMemo(() => connectors, [connectors])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded border border-cyan-500/40 bg-black/60 px-3 py-2 text-xs font-medium text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
      >
        Wallets
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 min-w-[220px] rounded-lg border border-zinc-700 bg-zinc-950/95 p-2 shadow-xl backdrop-blur">
          <p className="mb-2 px-1 text-[10px] uppercase tracking-wider text-zinc-500">
            Choose connector
          </p>
          <ul className="flex flex-col gap-1">
            {list.map((c) => (
              <li key={c.uid}>
                <button
                  type="button"
                  disabled={isPending}
                  className="w-full rounded border border-transparent px-2 py-2 text-left text-sm text-zinc-200 hover:border-cyan-500/40 hover:bg-cyan-500/10"
                  onClick={() => {
                    connect({ connector: c })
                    setOpen(false)
                  }}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-2 w-full rounded border border-zinc-600 py-2 text-xs text-zinc-400 hover:text-zinc-200"
            onClick={() => {
              disconnect()
              setOpen(false)
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
