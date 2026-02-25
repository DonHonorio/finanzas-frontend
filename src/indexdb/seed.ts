// Inserta datos demo iniciales en una base local recién creada.
export function seedInitialData(transaction: IDBTransaction) {
  const now = new Date().toISOString()

  // Cuentas base para poder registrar movimientos desde el primer uso.
  const accountsStore = transaction.objectStore("accounts")
  accountsStore.add({
    accountId: 1001,
    name: "Ahorro",
    type: "AHORROS",
    balance: "8420.50",
    currency: "EUR",
    number: "1024",
    order: 1,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    userId: 0,
    bankId: 1
  })
  accountsStore.add({
    accountId: 1002,
    name: "Cuenta Nómina",
    type: "CUENTA_NOMINA",
    balance: "2150.30",
    currency: "EUR",
    number: "7781",
    order: 2,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    userId: 0,
    bankId: 1
  })
  accountsStore.add({
    accountId: 1003,
    name: "Tarjeta Débito",
    type: "TARJETA_DEBITO",
    balance: "580.15",
    currency: "EUR",
    number: "4432",
    order: 3,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    userId: 0,
    bankId: 1
  })

  // Categorías de ejemplo para gastos e ingresos.
  const categoriesStore = transaction.objectStore("categories")
  categoriesStore.add({
    categoryId: 2001,
    name: "Alimentación",
    budget: "420.00",
    frequency: "FREQ=MONTHLY;COUNT=1",
    dtstart: "2026-01-01",
    icon: "🛒",
    type: "expense",
    color: "#F2994A",
    order: 1,
    isActive: true,
    withSubcategory: true,
    userId: 0,
    createdAt: now,
    updatedAt: now
  })
  categoriesStore.add({
    categoryId: 2002,
    name: "Transporte",
    budget: "150.00",
    frequency: "FREQ=MONTHLY;COUNT=1",
    dtstart: "2026-01-01",
    icon: "🚗",
    type: "expense",
    color: "#4F4F4F",
    order: 2,
    isActive: true,
    withSubcategory: false,
    userId: 0,
    createdAt: now,
    updatedAt: now
  })
  categoriesStore.add({
    categoryId: 3001,
    name: "Nómina",
    budget: "2400.00",
    frequency: "FREQ=MONTHLY;COUNT=1",
    dtstart: "2026-01-01",
    icon: "💰",
    type: "income",
    color: "#F0BD24",
    order: 1,
    isActive: true,
    withSubcategory: false,
    userId: 0,
    createdAt: now,
    updatedAt: now
  })

  // Subcategorías de ejemplo vinculadas a Alimentación.
  const subcategoriesStore = transaction.objectStore("subcategories")
  subcategoriesStore.add({
    subcategoryId: 4001,
    categoryId: 2001,
    name: "Supermercado",
    description: "Compras semanales en supermercado",
    budget: "280.00",
    color: "#F2C94C",
    order: 1,
    isActive: true,
    createdAt: now,
    updatedAt: now
  })
  subcategoriesStore.add({
    subcategoryId: 4002,
    categoryId: 2001,
    name: "Restaurantes",
    description: "Comidas fuera de casa",
    budget: "140.00",
    color: "#F2994A",
    order: 2,
    isActive: true,
    createdAt: now,
    updatedAt: now
  })

  // Movimientos iniciales para poblar dashboard y vistas de detalle.
  const transactionsStore = transaction.objectStore("transactions")

  transactionsStore.add({
    transactionId: "t-5001",
    name: "Compra semanal Mercadona",
    date: "2026-02-02",
    amount: 68.40,
    description: "Compra para toda la semana",
    type: "expense",
    currency: "EUR",
    createdAt: now,
    updatedAt: now,
    accountId: "1002",
    categoryId: "2001",
    subcategoryId: 4001
  })
  transactionsStore.add({
    transactionId: "t-5002",
    name: "Compra Carrefour",
    date: "2026-02-09",
    amount: 52.10,
    description: "Reposición de despensa",
    type: "expense",
    currency: "EUR",
    createdAt: now,
    updatedAt: now,
    accountId: "1002",
    categoryId: "2001",
    subcategoryId: 4001
  })
  transactionsStore.add({
    transactionId: "t-5003",
    name: "Compra Lidl",
    date: "2026-02-16",
    amount: 47.85,
    description: "Fruta y productos frescos",
    type: "expense",
    currency: "EUR",
    createdAt: now,
    updatedAt: now,
    accountId: "1003",
    categoryId: "2001",
    subcategoryId: 4001
  })

  transactionsStore.add({
    transactionId: "t-5004",
    name: "Cena con amigos",
    date: "2026-02-05",
    amount: 31.20,
    description: "Restaurante italiano",
    type: "expense",
    currency: "EUR",
    createdAt: now,
    updatedAt: now,
    accountId: "1003",
    categoryId: "2001",
    subcategoryId: 4002
  })
  transactionsStore.add({
    transactionId: "t-5005",
    name: "Comida de trabajo",
    date: "2026-02-12",
    amount: 19.90,
    description: "Menú del día",
    type: "expense",
    currency: "EUR",
    createdAt: now,
    updatedAt: now,
    accountId: "1002",
    categoryId: "2001",
    subcategoryId: 4002
  })
  transactionsStore.add({
    transactionId: "t-5006",
    name: "Tapas sábado",
    date: "2026-02-21",
    amount: 26.50,
    description: "Salida fin de semana",
    type: "expense",
    currency: "EUR",
    createdAt: now,
    updatedAt: now,
    accountId: "1003",
    categoryId: "2001",
    subcategoryId: 4002
  })

  transactionsStore.add({
    transactionId: "t-6001",
    name: "Nómina Febrero",
    date: "2026-02-01",
    amount: 2300.00,
    description: "Ingreso mensual empresa",
    type: "income",
    currency: "EUR",
    createdAt: now,
    updatedAt: now,
    accountId: "1002",
    categoryId: "3001"
  })
  transactionsStore.add({
    transactionId: "t-6002",
    name: "Variable objetivos",
    date: "2026-02-15",
    amount: 350.00,
    description: "Bono por cumplimiento de objetivos",
    type: "income",
    currency: "EUR",
    createdAt: now,
    updatedAt: now,
    accountId: "1002",
    categoryId: "3001"
  })
}
