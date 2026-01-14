import type { Dispatch, SetStateAction } from 'react'
import type { ModConfig, ModEnvironment } from '../types'

type Props = {
  config: ModConfig
  setConfig: Dispatch<SetStateAction<ModConfig>>
}

export function Step1BasicInfo({ config, setConfig }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Krok 1: Podstawowe informacje</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ścieżka do folderu media
          </label>
          <input
            type="text"
            required
            value={config.mediaPath}
            onChange={(e) => setConfig((c) => ({ ...c, mediaPath: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mod environment</label>
          <select
            value={config.modEnvironment}
            onChange={(e) =>
              setConfig((c) => ({
                ...c,
                modEnvironment: e.target.value as ModEnvironment,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="web">web</option>
            <option value="mobile">mobile</option>
            <option value="empire">empire</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mod name (np. 777 Spooky Hit)
          </label>
          <input
            type="text"
            required
            value={config.modName}
            onChange={(e) => setConfig((c) => ({ ...c, modName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mod folder (np. _777_spooky_hit)
          </label>
          <input
            type="text"
            required
            value={config.modFolder}
            onChange={(e) => setConfig((c) => ({ ...c, modFolder: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mod ID (np. 777-spooky-hit)
          </label>
          <input
            type="text"
            required
            value={config.modId}
            onChange={(e) => setConfig((c) => ({ ...c, modId: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mod prefix (np. 777sph)
          </label>
          <input
            type="text"
            required
            value={config.modPrefix}
            onChange={(e) => setConfig((c) => ({ ...c, modPrefix: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-600">Wszystkie pola są wymagane.</div>
    </div>
  )
}
