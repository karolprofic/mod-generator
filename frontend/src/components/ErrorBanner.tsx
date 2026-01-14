export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
      <div className="flex items-start gap-2">
        <div className="text-red-600 mt-0.5">⚠️</div>
        <div>
          <strong className="text-red-800">Błąd:</strong> {message}
          <div className="mt-2 text-sm text-red-700">
            Upewnij się, że backend działa na `http://localhost:3001` (Vite proxy na
            `/api`).
          </div>
        </div>
      </div>
    </div>
  )
}
