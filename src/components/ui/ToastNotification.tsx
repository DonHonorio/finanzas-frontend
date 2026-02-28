"use client"
import { ToastContainer } from 'react-toastify'

// Componente wrapper para las notificaciones toast
// Se importa en el layout de vista mensual para que esté disponible en la vista de la tabla
export default function ToastNotification() {
  return (
    <ToastContainer />
  )
}