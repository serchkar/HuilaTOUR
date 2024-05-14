import Link from 'next/link'
import React from 'react'

const CalificacionItem = ({calificacion}) => {
  return (
<Link href="/Lugares/[lugar]" as={`/Lugares/${calificacion[0]}`}>
<div className="bg-white rounded-lg shadow-sm p-4 w-80">
  <img
    className="w-12 h-12 rounded-full object-cover"
    src={calificacion[5]}
    alt="Imagen de perfil"
  />
  <div className="ml-4">
    <h3 className="text-xl font-semibold">{calificacion[1]}</h3>
    <div className="flex items-center mt-2">
      <svg
        className="w-4 h-4 text-yellow-500 mr-1"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 0L6 7H0l5 6L3 20l7-4 7 4-2-7 5-6h-6l-4-7z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-sm">{calificacion[6]}</span>
    </div>
  </div>
</div>
</Link>

  )
}

export default CalificacionItem