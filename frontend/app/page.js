"use client"
import MenuNav from "./Componentes/MenuNav"
import estilo from "./Styles/home.module.css"
import LugarItem from "./Componentes/LugarItem"
import { sitiosTop } from "./Services/sitios"
import { useEffect, useState, } from "react"
import Link from "next/link"

//importamos el estilo del modulo
export default function Home() {

  const [sitios, setSitios] = useState([])
  useEffect(() => {
    sitiosTop().then(res => setSitios(res)).catch(err => console.log(err))
  }, [])

  return (
    <main className=" flex flex-col w-full items-center">

    <section className={estilo.hero}>
      <div className="contenedor">
      <div className="md:max-w-lg text-white  flex flex-col gap-3 md:items-start items-center">
      <h1 className="md:text-5xl text-3xl">Conoce los mejores lugares del Huila</h1>
      <p>Descubre a donde ir según tus gustos.</p>
      <Link href="/Lugares"><button className={estilo.botonAccion}>Encuentra tu destino ideal</button></Link>
      </div>
      </div>
    </section>
    <section className={estilo.divpopulares +" contenedor"}>
      <h1 className="text-lg">Sitios Populares</h1>
      {
        sitios.map((item, index) => <LugarItem key={index} item={item} id={item[0]} sitio={item} />)
      }
    </section>
    </main>
  )
}
