"use client"
import axios from "axios";
import estilo from "../../styles/lugar.module.css";
import { useEffect, useState,useContext } from "react";
import ReactStars from 'react-stars'
import { traerLugar } from "@/app/Services/sitios";
import Image from "next/image";
import { calificarSitio } from "@/app/Services/login";
import { UserContext } from "@/app/Context/userContext";

export default function Page({ params }) {

    const [lugar, setLugar] = useState([]);
    const { userId } = useContext(UserContext);


    useEffect(() => {
        traerLugar(params.lugar).then(res => setLugar(res)).catch(err => console.log(err))

    }, []);



    const [rating, setRating] = useState(0) // initial rating value
    const handleRating = (rate) => {
        setRating(rate)
        // Some logic
    }
     
    const enviarCalificacion = async () => {
        const res = await calificarSitio(lugar[0], userId, rating)
        console.log(res)
        if (res.message == "Rating saved successfully") {
            alert("Calificación enviada")
        }
    }

    return (
        <main className=" flex flex-col w-full items-center">
            <div className={estilo.hero} style={
                {
                    backgroundImage: `url(${lugar[5]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    
                }
            }>
            
            <div className="contenedor flex flex-col items-center justify-center text-center gap-3">
            <h1 className="text-slate-100">{lugar[1]}</h1>
            <p className="w-2/3 text-slate-400">{lugar[3]}</p>
            <p className=" text-white font-bold bg-amarilloH-600 px-3 py-1 rounded-3xl">{lugar[4]}</p>

            </div>
            
            </div>
            <div className="contenedor flex flex-col items-center justify-center gap-3 p-10">
                <h2 className="font-black text-2xl">¿Ya fuiste?</h2>
                <span>Califica este lugar</span>
                <div className="flex flex-col items-center justify-center">
                <ReactStars count={5} onChange={handleRating} size={40} color2={'#ffd700'} value={rating} />
                <span>{rating}</span>
                {
                    userId ? <button 
                    onClick={() => enviarCalificacion()}
                    className="bg-verdeH-700 text-white px-3 py-1 rounded-xl">Enviar calificación</button> : <span>Inicia sesión para calificar</span>
                }
                

                </div>
                
            
            </div>
            
        </main>)
  }