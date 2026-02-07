"use client"
import { ToastContainer } from 'react-toastify'
import "react-toastify/ReactToastify.css"

// Componente wrapper para las notificaciones toast
// Se importa en el layout de vista mensual para que esté disponible en la vista de la tabla
export default function ToastNotification() {
  return (
    <ToastContainer />
  )
}