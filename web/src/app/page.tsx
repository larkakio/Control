import { CheckInPanel } from '@/components/wallet/CheckInPanel'
import { ControlGame } from '@/components/game/ControlGame'
import { NetworkBanner } from '@/components/wallet/NetworkBanner'
import { WalletHeader } from '@/components/wallet/WalletHeader'

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 pb-10 pt-2">
      <WalletHeader />
      <div className="mt-4 flex flex-col gap-4">
        <NetworkBanner />
        <ControlGame />
        <CheckInPanel />
      </div>
    </main>
  )
}
