import type { Hex } from 'viem'

import { Attribution } from 'ox/erc8021'

/**
 * ERC-8021 data suffix for Base Builder Codes.
 * Prefer NEXT_PUBLIC_BUILDER_CODE (e.g. bc_…) via ox; optional hex override per PROMPT.
 */
export function getCheckInDataSuffix(): Hex | undefined {
  const rawOverride = process.env.NEXT_PUBLIC_BUILDER_CODE_SUFFIX
  if (rawOverride && rawOverride.startsWith('0x')) {
    return rawOverride as Hex
  }
  const code = process.env.NEXT_PUBLIC_BUILDER_CODE
  if (!code?.trim()) return undefined
  return Attribution.toDataSuffix({ codes: [code.trim()] })
}
