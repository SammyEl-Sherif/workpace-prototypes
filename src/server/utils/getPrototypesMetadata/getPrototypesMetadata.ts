import fs from 'fs'
import path from 'path'

import { Prototype, PrototypeMeta } from '@/interfaces/prototypes'

export const getPrototypesMetadata = (): Prototype[] => {
  const prototypesDir = path.join('pages/prototypes')
  const files = fs.readdirSync(prototypesDir)

  const prototypes =
    files &&
    files
      .filter((file) => file !== 'index.tsx') // Exclude the index file
      .map((file) => {
        const fileName = file.replace('.tsx', '')
        const name = fileName
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')

        // Construct the path that matches the Routes enum
        const routePath = `prototypes/${fileName}` as keyof typeof PrototypeMeta

        // Check if this route exists in PrototypeMeta
        const meta = PrototypeMeta[routePath]
        if (!meta) {
          console.warn(`No metadata found for prototype: ${routePath}`)
          return null
        }

        return {
          name: `${meta.icon} ${name}`,
          path: `/${routePath}`,
          description: meta.description,
          icon: meta.icon,
          stage: meta.stage,
          tech: meta.tech,
        }
      })
      .filter((prototype) => prototype !== null) // Remove null entries

  return prototypes as Prototype[]
}
