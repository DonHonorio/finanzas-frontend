type NoDataProps = {
  label: string
  year: number
}

// no hay datos que mostrar pero no hay error
export function NoData({ label, year }: NoDataProps) {
  return (
    <div className="p-10 text-center text-muted-foreground">
      No hay {label} para {year}
    </div>
  )
}
