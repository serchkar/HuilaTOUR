"use client";
import estilo from "../Styles/home.module.css";
import Image from "next/image";
import Link from "next/link";
import { UserContext } from "../Context/userContext";
import { useContext, useState, useEffect } from "react";
const MenuNav = () => {
  const { userId } = useContext(UserContext);
  const [sesionIniciada, setSesionIniciada] = useState(false);
  useEffect(() => {
    if (userId) {
      setSesionIniciada(true);
    } else {
      setSesionIniciada(false);
    }
  }, [userId]);

  

  return (
    <div className={estilo.menu}>
      <div className={estilo.logo}>
        <Link href="/">
        <Image
          src="/Assets/logo.png"
          alt="logo"
          width={300}
          height={200}
          className="md:w-64 cursor-pointer w-40 "
        />
        </Link>
      </div>
      <div className={estilo.navegacion}>
        <ul className="flex flex-row justify-center items-center gap-2">  
            <li className="text-white hover:text-amarilloH-500"><Link href="/Lugares">Explorar</Link></li>
            <li className="text-white hover:text-amarilloH-500"><Link href="/Sitios">Todos los Sitios</Link></li>
            {
              sesionIniciada ? (
                <li className="text-white hover:text-amarilloH-500"><Link href="/Perfil">Ver tus calificaciones</Link></li>
              ) : (
                <li className={estilo.botonLogin}><Link href="/Login">Iniciar Sesion</Link></li>
              )
            }
            
   
        </ul>
      </div>
    </div>
  );
};

export default MenuNav;
