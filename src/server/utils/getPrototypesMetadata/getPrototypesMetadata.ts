import fs from 'fs'
import path from 'path'

import { Prototype, PrototypeMeta } from '@/interfaces/prototypes'

export const getPrototypesMetadata = (): Prototype[] => {
  const prototypesDir = path.join('pages/prototypes')
  const files = fs.readdirSync(prototypesDir)

  const prototypes = files.map((file) => {
    const name = file
      .replace('.tsx', '')
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    const path = `prototypes/${file.replace('.tsx', '')}` as keyof typeof PrototypeMeta
    const description = PrototypeMeta[path as keyof typeof PrototypeMeta].description
    const icon = PrototypeMeta[path as keyof typeof PrototypeMeta].icon
    const stage = PrototypeMeta[path as keyof typeof PrototypeMeta].stage

    return {
      name: `${icon} ${name}`,
      path: `/${path}`,
      description,
      icon,
      stage,
    }
  })

  return prototypes
}
