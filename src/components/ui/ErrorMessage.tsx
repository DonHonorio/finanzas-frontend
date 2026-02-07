// Componente para mostrar mensajes de error de forma consistente en la aplicación
// Se puede usar para mostrar errores de validación, errores de red, o cualquier otro tipo de error que queramos destacar al usuario
// El diseño es simple pero llamativo, con fondo rojo y texto blanco en mayúsculas para captar la atención
export default function ErrorMessage({children} : {children: React.ReactNode}) {
  return (
    <p className="text-center my-4 bg-red-600 text-white font-bold p-3 uppercase text-sm">{children}</p>
  )
}
