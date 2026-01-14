import type { Dispatch, SetStateAction } from 'react'
import type { FileRef, ModConfig } from '../types'
import { FileListStep } from './FileListStep'
import { toggleFileRef } from '../utils/fileRef'

export function Step5ConfigFiles({
  configFiles,
  loading,
  config,
  setConfig,
}: {
  configFiles: FileRef[]
  loading: boolean
  config: ModConfig
  setConfig: Dispatch<SetStateAction<ModConfig>>
}) {
  // Display the configuration files chosen by the user in step 5
  return (
    <FileListStep
      items={configFiles}
      title="Krok 5: Wybór plików konfiguracyjnych"
      emptyText="Brak plików konfiguracyjnych dla tej gry."
      loading={loading}
      selected={config.selectedConfigFiles}
      onToggle={(item) =>
        setConfig((c) => ({ ...c, selectedConfigFiles: toggleFileRef(c.selectedConfigFiles, item) }))
      }
    />
  )
}
