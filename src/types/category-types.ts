import { MonthlyData } from "./general-types"
import { Transaction } from "./transaction-types"

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
    withSubcategory: boolean
    createdAt?: string
    updatedAt?: string
    userId: number
}

export interface Subcategory {
    subcategoryId: number
    categoryId: number
    name: string
    description?: string
    budget: string
    color?: string
    order?: number
    isActive: boolean
    createdAt?: string
    updatedAt?: string
}

export type CategoryItem = {
    id: string
    type: 'transaction' | 'subcategory'
    date: string
    name: string
    budget: number
    monthlyData: MonthlyData
    color?: string
    originalTransaction?: Transaction
}
