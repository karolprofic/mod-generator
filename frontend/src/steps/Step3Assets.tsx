import type { Dispatch, SetStateAction } from 'react'
import type { FileRef, ModConfig } from '../types'
import { hasFileRef, toggleFileRef } from '../utils/fileRef'

type Props = {
  assets: FileRef[]
  assetsPreview: FileRef | null
  setAssetsPreview: (asset: FileRef | null) => void
  loading: boolean
  config: ModConfig
  setConfig: Dispatch<SetStateAction<ModConfig>>
}

export function Step3Assets({
  assets,
  assetsPreview,
  setAssetsPreview,
  loading,
  config,
  setConfig,
}: Props) {
  // No Vite proxy for /media: load directly from backend
  const assetPreviewUrl = assetsPreview
    ? `http://localhost:3001/${assetsPreview.path}`
    : undefined

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Krok 3: Wybór plików graficznych</h2>
      {loading ? <div>Ładowanie…</div> : null}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 mt-2">
        <div>
          <div className="space-y-2">
            {assets.map((asset) => (
              <div
                key={`${asset.path}::${asset.name}`}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={hasFileRef(config.selectedAssets, asset)}
                  onChange={() =>
                    setConfig((c) => ({
                      ...c,
                      selectedAssets: toggleFileRef(c.selectedAssets, asset),
                    }))
                  }
                  className="h-4 w-4 text-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setAssetsPreview(asset)}
                  className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 shrink-0"
                >
                  Podgląd
                </button>
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-gray-900 break-all">{asset.name}</div>
                  <div className="text-xs text-gray-500 break-all">{asset.path}</div>
                </div>
              </div>
            ))}
          </div>

          {!assets.length && !loading ? (
            <div className="mt-4 text-gray-600">Brak assetów dla tej gry.</div>
          ) : null}
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-white min-h-[200px] flex items-center justify-center">
          {assetsPreview ? (
            <div className="text-center w-full">
              <div className="mb-3 text-sm font-medium text-gray-700">
                Podgląd: {assetsPreview.name}
              </div>
              <img
                src={assetPreviewUrl}
                alt={assetsPreview.name}
                className="max-h-64 max-w-full object-contain rounded border"
                onError={() => setAssetsPreview(null)}
              />
            </div>
          ) : (
            <div className="text-gray-500 text-center">Wybierz plik do podglądu.</div>
          )}
        </div>
      </div>
    </div>
  )
}
