//axios intercepter will intercept any request of the user, check if we have access token and then
//it will automatically add headers so we don't need to manually write it multipple times in code

import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

const api = axios.create({
    baseURL : import.meta.env.VITE_API_URL  
})

//later in path we can directly use baseURL as is and don;'t need to worry about auth and all as its taken care of by axios

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
        //this is how we pass a JWT access token, simply create an authorization header, needs to start with bearer then a space then the token.
    },
    (error) => {
        return Promise.reject(error)
    }
)


export default api
//now on use api object rather than "axios" by default.. auth token will automatically be added 
