import axios from "axios";
import {toast} from 'react-toastify'


const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
      headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true,
})

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

api.interceptors.response.use(
    (response) => response,
    (error) =>{
        if(error.response && error.response.status === 401){
            toast.error("Session expired. Please login again");

            localStorage.removeItem('token');
            localStorage.removeItem('user');

            window.location.href = ('/login');
        }

        return Promise.reject(error)
    }
)

export default api