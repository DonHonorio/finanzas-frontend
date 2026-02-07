export interface Category {
    categoryId: number
    name: string
    budget: string
    frequency: string
    dtstart: string
    icon: string
    type: 'income' | 'expense'
    color: string
    order: number
    isActive: boolean
    createdAt?: string
    updatedAt?: string
    userId: number
}
