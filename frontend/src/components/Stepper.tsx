import type { StepId } from '../types'

export function StepPill({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
      }`}
    >
      {label}
    </div>
  )
}

export function Stepper({ step, labels }: { step: StepId; labels: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {labels.map((label, index) => (
        <StepPill
          key={label}
          label={label}
          active={step === ((index + 1) as StepId)}
        />
      ))}
    </div>
  )
}
