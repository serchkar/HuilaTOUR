import axios from "axios"
//localhost en puerto 5000
const api = "http://localhost:5000/"

export const traerSitios = async () => {
    const res = await axios.get(api + "sitios")
    return res.data
}    



export const sitiosTop = async () => {
    const res = await axios.get(api + "main")
    return res.data
}

export const traerLugar = async (id) => {
    const res = await axios.get(api + "sitios/" + id)
    return res.data
}
//http://localhost:5000/usuario/(id)/recomendaciones
export const traerLugaresRecomendados = async (id) => {
    const res = await axios.get(api + "usuario/" + id + "/recomendaciones")
    console.log(res.data)
    return res.data
}