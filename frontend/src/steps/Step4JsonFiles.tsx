import type { Dispatch, SetStateAction } from 'react'
import type { FileRef, ModConfig } from '../types'
import { FileListStep } from './FileListStep'
import { toggleFileRef } from '../utils/fileRef'

export function Step4JsonFiles({
  jsonFiles,
  loading,
  config,
  setConfig,
}: {
  jsonFiles: FileRef[]
  loading: boolean
  config: ModConfig
  setConfig: Dispatch<SetStateAction<ModConfig>>
}) {
  return (
    <FileListStep
      items={jsonFiles}
      title="Krok 4: Wybór plików JSON"
      emptyText="Brak plików JSON dla tej gry."
      loading={loading}
      selected={config.selectedJson}
      onToggle={(item) =>
        setConfig((c) => ({ ...c, selectedJson: toggleFileRef(c.selectedJson, item) }))
      }
    />
  )
}
