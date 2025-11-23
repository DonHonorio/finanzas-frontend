"use server"

export async function prueba() {
    const url = `${process.env.API_URL}/prueba`
    const req = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    console.log('RUTA: ', url)
    console.log('RESPUESTA DEL SERVIDOR:', req)
    const json = await req.json()

    if(!req.ok)  {
        const error = new Error('Error en el servidor')
        throw error
    }
    return json
}

export async function crearNombre(prevState: number, formData: FormData) {

    const name = formData.get('name')

    const url = `${process.env.API_URL}/nombre`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
    })
    const json = await req.json()

    if(!req.ok)  {
        const error = new Error('Error en el servidor')
        throw error
    }
    return prevState+1
}

export async function obtenerNombres() {
    const url = `${process.env.API_URL}/nombres`
    const req = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const json = await req.json()
    if(!req.ok)  {
        const error = new Error('Error en el servidor')
        throw error
    }
    return json
}