import './css/Login.css'

import { useEffect, useLayoutEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useContext } from "react"

import { AuthContext } from "../AuthContext"

export const Login = () => {

    const navigate = useNavigate()

    const [formUsername, setFormUsername] = useState('')
    const [formPassword, setFormPassword] = useState('')
    const [error, setError] = useState('')
    const {username, axiosInstance, handleAuth, handleLogin, handleLogout} = useContext(AuthContext)

    useEffect(()=> {
        handleAuth()
    }, [])


    async function handleSubmit(e){
        try{
            const reqData = {username: formUsername.toLowerCase(), password: formPassword}
            const res = await axiosInstance.post('/users/login', reqData)
            handleLogin(res.data.loginToken.toString())
        }
        catch(e){
            if (Object.hasOwn(e, "response")){
                setError(e.response.data.error)
            }
            else{
                console.log(e)
                setError('Server error occured!')
            }
            
            
        }

        
        

    }

    return (
        <>

            <div className="login">

                <h1 className='logo'><span>Go</span><br></br>together</h1>

                <div className="card">

                    {username? 
                    <>
                    <h1>You're logged in as, {username}!</h1>
                    <div className="btn-holder">

                        <button className='btn btn-2' onClick={handleLogout}>Log out!</button>
                        <button className='btn btn-1' onClick={e => {navigate('/trips')}}>See trips</button>

                    </div>
                    
                    </>
                    :
                    <>
                    <h1>Login to continue!</h1>
                    <input type="text" placeholder='Username' name="username" id="username" value={formUsername} onChange={ e => setFormUsername(e.target.value)} />
                    <input type="password" placeholder='Password' name="password" id="password" value={formPassword} onChange={ e => setFormPassword(e.target.value)} />
                    <div className="btn-holder">
                        <button className='btn btn-2' onClick={handleSubmit}>Log in!</button>
                        <Link className='btn btn-1' to='/signup'>Sign up</Link>
                    </div>
                    
                    {error && <h3>Error: {error}</h3>}
                    </>
                    }

                </div>

            

            </div>


            
            
        </>
    )
}
