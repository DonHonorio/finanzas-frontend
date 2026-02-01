export const columnWidths: Record<string, string> = {
    category: '12%',   // Nombre de categoría
    budget: '6%',      // Presupuesto
    enero: '6%',       // Meses: cada uno ocupa 6% del ancho total
    febrero: '6%',
    marzo: '6%',
    abril: '6%',
    mayo: '6%',
    junio: '6%',
    julio: '6%',
    agosto: '6%',
    septiembre: '6%',
    octubre: '6%',
    noviembre: '6%',
    diciembre: '6%',
}

export const getCellColor = (value: number, budget: number, isExpense: boolean) => {
    // Determina el color de fondo para celdas de la tabla según:
    // - value: cantidad gastada/ingresada en ese mes
    // - budget: presupuesto asignado a la categoría
    // - isExpense: identifica el tipo de dato (gasto o ingreso)
    
    if (value === 0) return "bg-muted/30"           // Sin movimiento este mes
    if (budget === 0) return "bg-secondary/30"      // Categoría sin presupuesto asignado

    if (isExpense) {
        // Para GASTOS:
        if (value > budget) return "bg-accent/40 text-foreground"  // Superó el presupuesto
        return "bg-secondary/30 text-foreground"                   // Dentro del presupuesto
    }

    // Para INGRESOS: mismo color siempre
    return "bg-accent/40 text-foreground"
}