"use client"

import { prueba } from "@/src/actions/prueba-action"
import { useActionState } from "react"

export default function Boton() {

    const [state, dispatch] = useActionState(prueba, '')

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
