"use client"

import { crearNombre, obtenerNombres } from "@/actions/prueba-action"
import { use, useActionState, useEffect, useState } from "react"

type Nombre = {
    id: number,
    name: string,
    createdAt: string,
    updatedAt: string
}

export default function ListaNombres() {

    const [state, dispatch] = useActionState(crearNombre, 0)
    const [data, setData] = useState<Nombre[]>([])

    const fetchNombres = async () => obtenerNombres()

    useEffect(() =>{
        console.log('STATE: ', state)
        if(state) {
            fetchNombres().then(nombres => setData(nombres))
        }
    }, [state])

    useEffect(() => {
        fetchNombres().then(nombres => setData(nombres))
    }, [])

    return (
        <>
            <div className="h-full flex flex-col justify-between">
                <ul>
                    {data.map(nombre => (
                        <li key={nombre.id}>{nombre.name}</li>
                    ))}
                </ul>

                <form action={dispatch} className="bg-green-200">
                    <input type="text" name="name" placeholder="Agregar nombre" className="p-2 m-2 rounded-md"/>
                    <button type="submit" className="bg-green-400 p-2 m-2 rounded-md hover:bg-green-500 transition">Agregar</button>
                </form>
            </div>
        </>
    )
}
