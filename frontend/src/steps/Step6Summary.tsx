import type { FileRef, ModConfig } from '../types'

type Props = {
  config: ModConfig
  loading: boolean
  onGenerate: () => void
}

function FileSection({ title, items }: { title: string; items: FileRef[] }) {
  return (
    <div>
      <div className="text-sm font-semibold text-gray-800 mb-2">{title}</div>
      {items.length ? (
        <div className="space-y-2">
          {items.map((f) => (
            <div
              key={`${f.path}::${f.name}`}
              className="bg-white border border-gray-200 rounded-lg p-3"
            >
              <div className="text-sm text-gray-900 break-all">{f.name}</div>
              <div className="text-xs text-gray-500 break-all">{f.path}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">Brak.</div>
      )}
    </div>
  )
}

export function Step6Summary({ config, loading, onGenerate }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Krok 6: Podsumowanie</h2>

      <div className="space-y-6 mt-4">
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Konfiguracja</h3>
          <div className="bg-gray-50 p-4 rounded-md text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-gray-500">Media path:</span>{' '}
                <span className="font-medium text-gray-900 break-all">{config.mediaPath}</span>
              </div>
              <div>
                <span className="text-gray-500">Environment:</span>{' '}
                <span className="font-medium text-gray-900">{config.modEnvironment}</span>
              </div>
              <div>
                <span className="text-gray-500">Mod name:</span>{' '}
                <span className="font-medium text-gray-900 break-all">{config.modName}</span>
              </div>
              <div>
                <span className="text-gray-500">Mod folder:</span>{' '}
                <span className="font-medium text-gray-900 break-all">{config.modFolder}</span>
              </div>
              <div>
                <span className="text-gray-500">Mod ID:</span>{' '}
                <span className="font-medium text-gray-900 break-all">{config.modId}</span>
              </div>
              <div>
                <span className="text-gray-500">Mod prefix:</span>{' '}
                <span className="font-medium text-gray-900 break-all">{config.modPrefix}</span>
              </div>
              <div>
                <span className="text-gray-500">Game:</span>{' '}
                <span className="font-medium text-gray-900">{config.game ?? '-'}</span>
              </div>
            </div>
          </div>
        </div>

        <FileSection title="Assety" items={config.selectedAssets} />
        <FileSection title="JSON" items={config.selectedJson} />
        <FileSection title="Config files" items={config.selectedConfigFiles} />

      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          onClick={onGenerate}
          disabled={loading}
        >
          Generuj
        </button>
      </div>
    </div>
  )
}
