import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../AuthContext'

import './css/SignUp.css'

export const SignUp = () => {


    const [formUsername, setFormUsername] = useState('')
    const [formPassword, setFormPassword] = useState('')
    const [formEmail, setFormEmail] = useState('')
    const [formFullName, setFormFullName] = useState('')
    const [formDateOfBirth, setFormDateOfBirth] = useState('')
    const [error, setError] = useState('')
    const [success, setSucces] = useState('')

    const {username,axiosInstance, handleAuth, handleLogout} = useContext(AuthContext)
    useEffect(() => {
        handleAuth()
    },[])


    async function handleSignup(){
        if (!formPassword || !formUsername || !formEmail){
            setError('Fields can not be empty')
            return
        }
        try{
            const reqData = {
                username: formUsername.toLowerCase(),
                password: formPassword,
                email: formEmail.toLowerCase()
            }
            const res = await axiosInstance.post('/users/signup', reqData)
            setSucces('Succesfully signed up!')


        }
        catch(e){
            if (Object.hasOwn(e, 'response')){
                setError(e.response.data.error)
            }
            else{
                setError('Server error occured')
            }
        }
        
    }

  return (
    <>
    <div className="sign-up">

        <div className="header">
            <Link to ='/'>
            <h1 className='logo'><span>Go</span><br></br>together</h1>
            </Link>
        </div>

        {username?
        <>
            <h1>You're already logged in!</h1>
            <button onClick={handleLogout}>Logout</button>
        </>
        :
        <>

                {success? 


                <>
                    <h1>{success}</h1>
                    <Link className='btn btn-1' to = '/login'>login</Link>
                </>

            :
                <>
                    <h1>Signup</h1>
                    <label>username: </label>
                    <input type="text" value={formUsername} onChange={e => setFormUsername(e.target.value)}/>
                    <label>Full name: </label>
                    <input type="text" value={formUsername} onChange={e => setFormFullName(e.target.value)}/>
                    <label>Date of Birth: </label>
                    <input type="text" value={formUsername} onChange={e => setFormDateOfBirth(e.target.value)}/>
                    <label>email: </label>
                    <input type="text" value={formEmail} onChange={e => setFormEmail(e.target.value)}/>
                    <label>password: </label>
                    <input type="text" value={formPassword} onChange={e => setFormPassword(e.target.value)}/>
                    <button className='btn btn-1' onClick={handleSignup}>Sign Up</button>
                    
                    {error && <h1>error: {error}</h1>}
                </>

            }

        </>
        }
    </div>
    
    </>
  )

}
