"use client"
import React, { useState } from 'react'
import estilo from '../Styles/login.module.css'
import { registrar } from '../Services/login'
import Router from 'next/router'
import Link from 'next/link'

const Register = () => {
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
    const [name, setName] = useState('')

  const handleSubmit = async (e) => {
      e.preventDefault()

        const res = await registrar(email, password, name)
        console.log(res)
        if(res.message == 'Welcome new user'){
            alert('Registro exitoso')
            Router.push('/Login')
        }else{
            alert('Error al registrar')
        }

        




      
  }

  return (
    <main className={estilo.hero}>
        <h3 className='text-2xl font-semibold bg-verdeH-800 px-10 py-1 rounded-full rounded-b-none shadow-2xl'>Registrate</h3>
        <div className='w-80  bg-white rounded-lg shadow-2xl'>
            <form className='flex flex-col gap-4 p-10 text-zinc-900' 
            onSubmit={handleSubmit}>
                <label htmlFor='name'>Nombre</label>
                <input type='name' id='name' className='border border-gray-400 rounded-lg p-2'
                value={name}
                onChange={(e) => setName(e.target.value)} />

                <label htmlFor='email'>Email</label>
                <input type='email' id='email' className='border border-gray-400 rounded-lg p-2' 
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor='password'>Password</label>
                <input type='password' id='password' className='border border-gray-400 rounded-lg p-2' 
                onChange={(e) => setPassword(e.target.value)} value={password}
                />
                <button className='bg-verdeH-500 text-white rounded-lg p-2 hover:bg-verdeH-700 transition-colors'>Registrarse</button>
                {/* añadimos un boton con estilo secundario (fantasma) para el registro: */}
                <Link href="/Login"> <button className='bg-transparent text-verdeH-500 border border-verdeH-500 hover:text-black rounded-lg p-2 transition-colors'>Iniciar Sesion</button></Link>
            </form>

        </div>
    </main>
  )
}

export default Register