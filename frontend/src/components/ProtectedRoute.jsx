import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState, useEffect} from "react"

function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(()=> {
        auth().catch(() => setIsAuthorized(false))
    }, [])




    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        
        try {

            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            }); //this beautiful syntax is all axios. axios automatically serializes the object to json and sets the content-type header to application/json for u

            if(res.status === 200) {//equivalent to success
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }

        } catch (error) {
            console.log(error)
            setIsAuthorized(false)
        }


    }

    const auth = async () => {
       const token = localStorage.getItem(ACCESS_TOKEN)
       //check if we have access token or not
       if(!token) {
        setIsAuthorized(false)
        return
       }
       
       //token present: check this token has expired or not
       const decoded = jwtDecode(token)
       const tokenExpiration = decoded.exp
       const now = Date.now() / 1000 //to get date in seconds not ms

       if(tokenExpiration < now) {
        //automatically renew access token using refresh token.
         await refreshToken()
       } else {
        //if unexpired: authorize ✅
         setIsAuthorized(true)
       }
    }

    if(isAuthorized === null) {
        return <div>Loading...</div>
    }

    return isAuthorized ? children : <Navigate to = "/login" /> 


}


export default ProtectedRoute