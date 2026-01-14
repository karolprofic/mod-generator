import type { FileRef } from '../types'

type ApiFileItem = string | { name?: unknown; path?: unknown }

export function normalizeFileItems(game: string, items: unknown): FileRef[] {
  if (!Array.isArray(items)) return []

  return (items as ApiFileItem[])
    .map((item) => {
      // Old API shape: ["file.png", ...]
      if (typeof item === 'string') {
        return { name: item, path: `media/${game}/${item}` }
      }

      // New API shape: [{ name, path }, ...]
      if (item && typeof item === 'object') {
        const maybeName = (item as { name?: unknown }).name
        const maybePath = (item as { path?: unknown }).path

        const path =
          typeof maybePath === 'string'
            ? maybePath
            : typeof maybeName === 'string'
              ? `media/${game}/${maybeName}`
              : null

        if (!path) return null

        const name =
          typeof maybeName === 'string' && maybeName.trim().length > 0
            ? maybeName
            : path.split('/').filter(Boolean).at(-1) ?? path

        return { name, path }
      }

      return null
    })
    .filter((x): x is FileRef => x !== null)
}
