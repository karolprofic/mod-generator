export type ModEnvironment = 'web' | 'mobile' | 'empire'

export type StepId = 1 | 2 | 3 | 4 | 5 | 6

export type FileRef = { name: string; path: string }

export type ModConfig = {
  mediaPath: string
  modName: string
  modFolder: string
  modId: string
  modPrefix: string
  modEnvironment: ModEnvironment
  game?: string
  selectedAssets: FileRef[]
  selectedJson: FileRef[]
  selectedConfigFiles: FileRef[]
}
