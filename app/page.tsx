import Boton from "@/components/prueba/Boton"
import { prueba } from "@/actions/prueba-action"
import ListaNombres from "@/components/prueba/ListaNombres";

export default async function Home() {

  return (
    <>
      <div className="h-screen w-full">
        <div className="h-1/2 flex flex-col items-center">
          <h1 className="text-6xl font-bold mb-4">Finanzas Personales</h1>
          <ListaNombres />
        </div>
        <div className="flex flex-col justify-center items-center space-y-4 h-1/2">

          <Boton />
          {/* <Nombre /> */}

          <div className="text-4xl bg-blue-400 text-white p-8 rounded-lg">
            Bienvenido a la aplicación de Finanzas Personales
          </div>
        </div>

      </div>
    </>
  );
}
