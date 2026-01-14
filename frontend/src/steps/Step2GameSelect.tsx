import type { Dispatch, SetStateAction } from 'react'
import type { ModConfig } from '../types'

type Props = {
  games: string[]
  loading: boolean
  config: ModConfig
  setConfig: Dispatch<SetStateAction<ModConfig>>
}

export function Step2GameSelect({ games, loading, config, setConfig }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Krok 2: Wybór gry</h2>
      {loading ? <div className="text-center py-4">Ładowanie…</div> : null}

      <div className="space-y-2">
        {games.map((g) => {
          const checked = config.game === g
          return (
            <label
              key={g}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                checked
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="game"
                checked={checked}
                onChange={() =>
                  setConfig((c) => ({
                    ...c,
                    game: g,
                    selectedAssets: [],
                    selectedJson: [],
                    selectedConfigFiles: [],
                  }))
                }
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-3 font-medium text-gray-800">{g}</span>
            </label>
          )
        })}
      </div>

      {!games.length && !loading ? (
        <div className="mt-4 text-center text-gray-600">
          Brak danych z API. Sprawdź backend.
        </div>
      ) : null}
    </div>
  )
}
