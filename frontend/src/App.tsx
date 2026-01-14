import { useEffect, useMemo, useState } from 'react'

import { apiGet, apiPost } from './api/client'
import { ErrorBanner } from './components/ErrorBanner'
import { Stepper } from './components/Stepper'
import { Step1BasicInfo } from './steps/Step1BasicInfo'
import { Step2GameSelect } from './steps/Step2GameSelect'
import { Step3Assets } from './steps/Step3Assets'
import { Step4JsonFiles } from './steps/Step4JsonFiles'
import { Step5ConfigFiles } from './steps/Step5ConfigFiles'
import { Step6Summary } from './steps/Step6Summary'
import type { FileRef, ModConfig, StepId } from './types'
import { hasFileRef } from './utils/fileRef'
import { normalizeFileItems } from './utils/normalize'

function defaultConfig(): ModConfig {
  return {
    mediaPath: './engin3/media/',
    modName: '',
    modFolder: '',
    modId: '',
    modPrefix: '',
    modEnvironment: 'web',
    selectedAssets: [],
    selectedJson: [],
    selectedConfigFiles: [],
  }
}

export default function App() {
  const [step, setStep] = useState<StepId>(1)

  const [config, setConfig] = useState<ModConfig>(() => defaultConfig())

  const [games, setGames] = useState<string[]>([])
  const [assets, setAssets] = useState<FileRef[]>([])
  const [jsonFiles, setJsonFiles] = useState<FileRef[]>([])
  const [configFiles, setConfigFiles] = useState<FileRef[]>([])

  const [assetsPreview, setAssetsPreview] = useState<FileRef | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generateResult, setGenerateResult] = useState<unknown>(null)

  // Ensure selected files still exist after reload
  useEffect(() => {
    if (assets.length > 0) {
      setConfig((c) => ({
        ...c,
        selectedAssets: c.selectedAssets.filter((sel) => hasFileRef(assets, sel)),
      }))
    }
  }, [assets])

  useEffect(() => {
    if (jsonFiles.length > 0) {
      setConfig((c) => ({
        ...c,
        selectedJson: c.selectedJson.filter((sel) => hasFileRef(jsonFiles, sel)),
      }))
    }
  }, [jsonFiles])

  useEffect(() => {
    if (configFiles.length > 0) {
      setConfig((c) => ({
        ...c,
        selectedConfigFiles: c.selectedConfigFiles.filter((sel) => hasFileRef(configFiles, sel)),
      }))
    }
  }, [configFiles])

  const stepLabels = useMemo(
    () => ['1. Info', '2. Gra', '3. Assety', '4. JSON', '5. Config', '6. Podsumowanie'],
    [],
  )

  useEffect(() => {
    setError(null)
    if (step !== 2) return

    setLoading(true)
    apiGet<string[]>('/api/games')
      .then(setGames)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false))
  }, [step])

  useEffect(() => {
    setError(null)
    const game = config.game
    if (!game) return

    if (step === 3) {
      setLoading(true)
      apiGet<unknown>(`/api/games/${encodeURIComponent(game)}/assets`)
        .then((data) => {
          const normalized = normalizeFileItems(game, data)
          setAssets(normalized)
          setAssetsPreview(normalized[0] || null)
        })
        .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
        .finally(() => setLoading(false))
    }

    if (step === 4) {
      setLoading(true)
      apiGet<unknown>(`/api/games/${encodeURIComponent(game)}/json`)
        .then((data) => setJsonFiles(normalizeFileItems(game, data)))
        .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
        .finally(() => setLoading(false))
    }

    if (step === 5) {
      setLoading(true)
      apiGet<unknown>(`/api/games/${encodeURIComponent(game)}/config`)
        .then((data) => setConfigFiles(normalizeFileItems(game, data)))
        .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
        .finally(() => setLoading(false))
    }
  }, [config.game, step])

  const canGoNext = useMemo(() => {
    if (step === 1) {
      return (
        config.mediaPath.trim().length > 0 &&
        config.modName.trim().length > 0 &&
        config.modFolder.trim().length > 0 &&
        config.modId.trim().length > 0 &&
        config.modPrefix.trim().length > 0
      )
    }
    if (step === 2) return Boolean(config.game)
    return true
  }, [
    config.game,
    config.mediaPath,
    config.modFolder,
    config.modId,
    config.modName,
    config.modPrefix,
    step,
  ])

  function goNext() {
    if (!canGoNext) return
    setStep((s) => (Math.min(6, s + 1) as StepId))
  }

  function goBack() {
    setStep((s) => (Math.max(1, s - 1) as StepId))
  }

  async function onGenerate() {
    setError(null)
    setGenerateResult(null)
    try {
      setLoading(true)
      const result = await apiPost('/api/generate', config)
      setGenerateResult(result)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Generator Modów</h1>
        </div>

        <Stepper step={step} labels={stepLabels} />

        {error ? <ErrorBanner message={error} /> : null}

        {step === 1 ? <Step1BasicInfo config={config} setConfig={setConfig} /> : null}

        {step === 2 ? (
          <Step2GameSelect
            games={games}
            loading={loading}
            config={config}
            setConfig={setConfig}
          />
        ) : null}

        {step === 3 ? (
          <Step3Assets
            assets={assets}
            assetsPreview={assetsPreview}
            setAssetsPreview={setAssetsPreview}
            loading={loading}
            config={config}
            setConfig={setConfig}
          />
        ) : null}

        {step === 4 ? (
          <Step4JsonFiles
            jsonFiles={jsonFiles}
            loading={loading}
            config={config}
            setConfig={setConfig}
          />
        ) : null}

        {step === 5 ? (
          <Step5ConfigFiles
            configFiles={configFiles}
            loading={loading}
            config={config}
            setConfig={setConfig}
          />
        ) : null}

        {step === 6 ? (
          <Step6Summary
            config={config}
            generateResult={generateResult}
            loading={loading}
            onGenerate={onGenerate}
          />
        ) : null}

        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1 || loading}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Wstecz
          </button>
          <button
            type="button"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            onClick={goNext}
            disabled={step === 6 || loading || !canGoNext}
          >
            Dalej
          </button>
        </div>
      </div>
    </div>
  )
}
