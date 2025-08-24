import React, {createContext, useEffect, useState} from 'react'
import axios from 'axios'

export const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const api_url = 'http://localhost:5000/'
    const [username, setUsername] = useState('')
    

    const axiosInstance = axios.create({baseURL: 'http://localhost:5000'})

    
    
    //checking if the jwt token exists and getting the username if so 
    async function handleAuth(){
        const storedLoginToken = localStorage.getItem('loginToken')
        if (storedLoginToken){
            axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + storedLoginToken
        }
        else{
            handleLogout()
            return
        }

        
        try {
            const res = await axiosInstance.get('/users/get_username')
            setUsername(res.data.username.toLowerCase())
        }
        catch(e){ //status code 469 means authentication failed
            if (e.response?.status == 469){
                handleLogout()
            }
            else{
                console.log('SERVER ERROR WHEN TRYING TO LOGIN')
                handleLogout()
            }
        }


    }

    //settng the jtw token into localstorage(mainly going to be used by the login component)
    function handleLogin(loginToken){
        if (!loginToken){
            handleLogout()
            return
        }
        localStorage.setItem('loginToken', loginToken)
        handleAuth()
    }

    //clearing out the jwt token and username
    function handleLogout(){
        localStorage.removeItem('loginToken')
        delete axiosInstance.defaults.headers.common['Authorization'];
        setUsername('')
    }



    return (
        <AuthContext.Provider value={{username, axiosInstance, handleAuth, handleLogin, handleLogout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider