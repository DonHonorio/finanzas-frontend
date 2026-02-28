'use client'

import { useState, useEffect } from 'react'

const MOBILE_MAX = 768   // < 768px → vista de tarjetas
const DESKTOP_MIN = 1536 // >= 1536px → tabla completa con divisa (768-1535 → tabla compacta)

export function useResponsive() {
    // Siempre inicia con DESKTOP_MIN para que SSR y cliente coincidan y evitar hydration mismatch
    const [width, setWidth] = useState(DESKTOP_MIN)

    useEffect(() => {
        // Primera sincronización con el ancho real del navegador tras la hidratación
        setWidth(window.innerWidth)

        let timer: ReturnType<typeof setTimeout>
        // Debounce de 100ms para evitar re-renders en cada píxel durante el resize
        const handle = () => {
            clearTimeout(timer)
            timer = setTimeout(() => setWidth(window.innerWidth), 100)
        }
        window.addEventListener('resize', handle)
        return () => {
            clearTimeout(timer)
            window.removeEventListener('resize', handle)
        }
    }, [])

    return {
        isMobile: width < MOBILE_MAX,
        isTablet: width >= MOBILE_MAX && width < DESKTOP_MIN,
        isDesktop: width >= DESKTOP_MIN,
    }
}
