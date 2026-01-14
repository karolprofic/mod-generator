import type { FileRef } from '../types'

export function removeFileRef(list: FileRef[], item: FileRef): FileRef[] {
  return list.filter((x) => !(x.name === item.name && x.path === item.path))
}

export function hasFileRef(list: FileRef[], item: FileRef): boolean {
  return list.some((x) => x.name === item.name && x.path === item.path)
}

export function toggleFileRef(list: FileRef[], item: FileRef): FileRef[] {
  return hasFileRef(list, item) ? removeFileRef(list, item) : [...list, item]
}
