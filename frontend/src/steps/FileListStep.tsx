import type { FileRef } from '../types'
import { hasFileRef } from '../utils/fileRef'

type Props = {
  items: FileRef[]
  title: string
  emptyText: string
  selected: FileRef[]
  onToggle: (item: FileRef) => void
  loading: boolean
}

export function FileListStep({ items, title, emptyText, selected, onToggle, loading }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {loading ? <div>Ładowanie…</div> : null}

      <div className="space-y-2 mt-2">
        {items.map((item) => (
          <div
            key={`${item.path}::${item.name}`}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={hasFileRef(selected, item)}
              onChange={() => onToggle(item)}
              className="h-4 w-4 text-blue-600"
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm text-gray-900 break-all">{item.name}</div>
              <div className="text-xs text-gray-500 break-all">{item.path}</div>
            </div>
          </div>
        ))}
      </div>

      {!items.length && !loading ? (
        <div className="mt-4 text-gray-600">{emptyText}</div>
      ) : null}
    </div>
  )
}
