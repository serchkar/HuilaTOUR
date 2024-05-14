"use client"
import React, { useContext, useEffect,useState } from 'react'
import { UserContext } from '../Context/userContext'
import { traerLugaresRecomendados } from '../Services/sitios'
import LugarItem from '../Componentes/LugarItem'

const page = () => {

  const [lugares, setLugares] = useState([])
  const [cargado, setCargado] = useState(false)
  const { userId } = useContext(UserContext)

  useEffect(() => {
    if (userId) {
      traerLugaresRecomendados(userId).then(res => {
        setLugares(res)
        setCargado(true)
      }).catch(err => console.log(err))
    }
  }, [userId])



  return (
<main className=" flex flex-col w-full items-center p-4">
  <div className='flex-col flex gap-4'>
    <h1>Lugares Recomendamos para ti</h1>
    <p>Te podrían interesar los siguientes sitios:</p>
  </div>
  <div className="flex flex-wrap justify-center gap-5 w-3/4 border-verdeH-700 border-2 p-2 rounded-2xl mt-5">
    {
      userId && lugares.length > 0 ?
        lugares.map((lugar, index) => {
          return <LugarItem key={index} sitio={lugar} />
        }
        )
        :
        <p className='bg-amarilloH-600 text-white'>No hay lugares recomendados para ti</p>

    }
  </div>
</main>  
  )
}

export default page