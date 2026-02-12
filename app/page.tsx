import Boton from "@/src/components/prueba/Boton"
import ListaNombres from "@/src/components/prueba/ListaNombres"

export default async function Home() {

  return (
    <>
      <div className="h-screen w-full">
        <div className="h-1/2 flex flex-col items-center">
          <h1 className="text-6xl font-bold mb-4">Finanzas Personales Pruebas 1.0</h1>
          <ListaNombres />
        </div>
        <div className="flex flex-col justify-center items-center space-y-4 h-1/2">

          <Boton />
          <div className="flex bg-amber-200">
            <div className="w-50 h-50 bg-violet-400 " />
            <div className="w-50 h-50 bg-violet-400 " />
          </div>

          <div className="text-4xl bg-blue-400 text-white p-8 rounded-lg ease-in-out">
            Bienvenido a la aplicación de Finanzas Personales
          </div>
        </div>

      </div>
    </>
  )
}
