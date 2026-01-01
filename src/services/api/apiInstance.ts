import axios from "axios"

const baseURL='https://upskilling-egypt.com:3000'

export const axiosPrivateInstance=axios.create({
    baseURL,
     headers: {
    "Content-Type": "application/json",
  },
})

axiosPrivateInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export const axiosPublicInstance=axios.create({
    baseURL
})
