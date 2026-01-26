import { Dashboard } from "@/components/vista-mensual/dashboard";

export default function Page() {
  return (
    <div className="h-screen p-10 box-border">
      <div className="h-full flex flex-col">

        {/* TÍTULO */}
        <header className="h-10 text-2xl text-center shrink-0">
          Vista Mensual
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 overflow-hidden">
          <Dashboard />
        </main>

        {/* BOTÓN */}
        <footer className="h-10 mt-4 flex justify-end shrink-0">
          <button className="w-80 bg-blue-500 text-white text-lg">
            Agregar Gasto
          </button>
        </footer>

      </div>
    </div>
  );
}
