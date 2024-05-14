"use client"
import React from 'react'
import CalificacionItem from '../Componentes/CalificacionItem'
import { traerCalificaciones } from '../Services/login'
import { UserContext } from '../Context/userContext'
import { useContext, useEffect, useState } from 'react'




const page = () => {
    const [calificaciones, setCalificaciones] = useState(null)
    const { userId } = useContext(UserContext)


    useEffect(() => {

        traerCalificaciones(userId).then(res => setCalificaciones(res)).catch(err => console.log(err))
    }, [])

  return (
<main className=" flex flex-col w-full items-center gap-3 p-4">
    <h1>Estas son tus calificaciones:</h1>
    {
        calificaciones ? calificaciones.map((calificacion, index) => {
            return <CalificacionItem key={index} calificacion={calificacion} />
        }
        ) : <h4>No hay calificaciones</h4>
    }


</main>
  )
}

export default page