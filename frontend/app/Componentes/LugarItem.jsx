import Link from "next/link"
import Estilo from "../styles/lugar.module.css"
const LugarItem = ({sitio}) => {
  return (
    <Link href={`/Lugares/${sitio[0]}`}>
    <div className="items-center justify-center flex-col flex cursor-pointer">
    <div className="w-48 h-32  overflow-hidden rounded-xl shadow-lg relative ">
      <div className={Estilo.overlay}>
        <p className={Estilo.text + " text-2xl font-bold"}>{sitio[2]}</p>
        <span className={Estilo.text + " bg-verdeH-800 rounded-2xl px-1 whitespace-pre-line  bg-opacity-60 "}>{sitio[4]}</span>
      </div>
      <img  className="w-full h-full bg-cover " src={sitio[5]} alt="" />
    </div>
    <h3 className="font-bold">{sitio[1]}</h3>
    </div>
    </Link>
  )
}

export default LugarItem