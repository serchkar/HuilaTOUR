"use client"

import React, { useContext, useEffect, useState } from 'react'
import LugarItem from '../Componentes/LugarItem'
import { traerSitios, sitiosTop } from '../Services/sitios'
'traerSitios'


const page = () => {

const [lugares, setLugares] = useState(null)


useEffect(() => {
    traerSitios().then(res => setLugares(res)).catch(err => console.log(err))
}, [])


  return (
    <main className=" flex flex-col w-full items-center gap-3 p-4">
        <h1>Todos los Sitios</h1>
        <div className='flex gap-4 w-4/5 flex-wrap items-center justify-center'>
            {
                lugares ? lugares.map((lugar, index) => {
                    return <LugarItem key={index} sitio={lugar} />
                }
                ) : <h4>No hay lugares</h4>
            }
        

        </div>
    </main>
  )
}

export default page