"use client"

import { addTask, getAllTasks } from "@/src/index-db"
import { useEffect, useState } from "react"

type Task = {
    title: string
    done: boolean
    createdAt: Date
}

export default function ListaNombres() {

    const [data, setData] = useState<Task[]>([])

    useEffect(() => {
        const fetchNombres = async () => {
            const tasks = await getAllTasks()
            setData(tasks as Task[])
        }
        fetchNombres()
    }, [])

    const createTarea = async (formData: FormData) => {
        const name = formData.get("name") as string
        await addTask(name)
        const tasks = await getAllTasks()
        setData(tasks as Task[])
        console.log(tasks)
    }

    return (
        <>
            <div className="h-full flex flex-col justify-between">
                <ul>
                    {data.map(dato => (
                        <li key={dato.createdAt.toString()}>{dato.title}</li>
                    ))}
                </ul>

                <form action={createTarea} className="bg-green-200">
                    <input type="text" name="name" placeholder="Agregar nombre" className="p-2 m-2 rounded-md" />
                    <button type="submit" className="bg-green-400 p-2 m-2 rounded-md hover:bg-green-500 transition">Agregar</button>
                </form>
            </div>
        </>
    )
}
