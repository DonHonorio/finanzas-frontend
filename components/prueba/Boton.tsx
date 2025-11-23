"use client"

import { prueba } from "@/actions/prueba-action"
import { useActionState, useEffect } from "react"

export default function Boton() {

    const [state, dispatch] = useActionState(prueba, '')

    useEffect(() => { {
        if(state && state.numero) {
            console.log('Respuesta de la acción de prueba:', state)
        }
    } }, [state])

    return (
        <>
        <form action={dispatch}>
            <button className="w-24 h-24 flex justify-center items-center bg-green-400 rounded-3xl shadow-lg cursor-pointer hover:bg-green-500 transition">
                {state.numero ?? ''}
            </button>
        </form>
        </>
    )
}
