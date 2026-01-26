import { CategoryRow } from "./types/dashboard-types";

// mockData.ts
export const data: CategoryRow[] = [
  {
    id: '1',
    name: 'Gimnasio',
    budget: 50,
    months: {
      enero: 50, febrero: 41, marzo: 50, abril: 50,
      mayo: 0, junio: 0, julio: 0, agosto: 0,
      septiembre: 0, octubre: 0, noviembre: 0, diciembre: 0,
    },
  },
  {
    id: '2',
    name: 'Suscripciones',
    budget: 39.04,
    months: {
      enero: 14.99, febrero: 1.37, marzo: 47.3, abril: 0,
      mayo: 0, junio: 0, julio: 0, agosto: 0,
      septiembre: 0, octubre: 0, noviembre: 0, diciembre: 0,
    },
  },
  {
    id: '3',
    name: 'Ocio',
    budget: 100,
    months: {
      enero: 122230, febrero: 80, marzo: 90, abril: 110,
      mayo: 95, junio: 100, julio: 130, agosto: 85,
      septiembre: 70, octubre: 150, noviembre: 60, diciembre: 200,
    },
  }
]
