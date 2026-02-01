type DataLoadingProps = {
  label: string
}

// loader básico -> se cambiará en un futuro
export function DataLoading({ label }: DataLoadingProps) {
  return (
    <div className="p-10 text-center text-muted-foreground">
      Cargando {label}...
    </div>
  )
}
