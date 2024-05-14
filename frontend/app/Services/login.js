import axios from "axios";

const api = "http://localhost:5000";

export const login = async (email, password) => {
    const res = await axios.post(api + "/login", { email, password });
    return res.data;
    }
export const registrar = async (email, password, name) => {
    const res = await axios.post(api + "/signup", { email, password, name });
    return res.data;
    }


export const calificarSitio = async (site_id, user_id, rating) => {
    const res = await axios.post(api + "/sitios/" + site_id + "/calificar", { site_id, user_id, rating });
    return res.data;
    }

    //http://localhost:5000//usuario/2/calificaciones
export const traerCalificaciones = async (id) => {
    const res = await axios.get(api + "/usuario/" + id + "/calificaciones");
    return res.data;
    }