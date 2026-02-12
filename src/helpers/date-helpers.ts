/**
 * Convierte fecha ISO a formato YYYY-MM-DD para input date
 */
export const toDateInputValue = (value?: string) => {
    if (!value) return ""
    const date = new Date(value)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
}
