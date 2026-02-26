"use client"

import { useTranslations } from "next-intl"

type DataErrorProps = {
  label: string
  year: number
  isRetrying: boolean
  onRetry: () => void
  error?: Error
}

// se ejecuta cuando ocurre una petición en la petición a la API
export function DataError({ label, year, isRetrying, onRetry, error }: DataErrorProps) {
  const t = useTranslations("CommonStatus")

  return (
    <div className="p-10 text-center text-destructive">
      <div className="text-lg font-semibold mb-2">
        {t("loadErrorTitle")}
      </div>
      <div className="text-sm mb-4">
        {t("loadErrorDescription", { label, year })}
      </div>
      {/* botón que permite reintentar la petición */}
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        disabled={isRetrying}
      >
        {isRetrying ? t("loadingShort") : t("retry")}
      </button>

      {/* Opcional: Mostrar detalles del error */}
      {process.env.NODE_ENV === 'development' && error && (
        <div className="mt-4 p-3 bg-destructive/10 rounded text-xs font-mono">
          {error.message}
        </div>
      )}
    </div>
  )
}
