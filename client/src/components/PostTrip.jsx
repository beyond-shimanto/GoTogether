import React, { useState,useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { RouteSelector } from './RouteSelector'
import TimeSelector from './TimeSelector'

import "./css/PostTrip.css"



export const PostTrip = () => {

    const navigate = useNavigate()    
    const {username, axiosInstance,handleAuth, handleLogout} = useContext(AuthContext)

    

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [tentativeTime, setTentativeTime] = useState('')
    const [tentativeRoute, setTentativeRoute] =  useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [authLoading, setAuthLoading] = useState(true)
    useEffect(()=>{

        async function checkAuth() {
            await handleAuth()
            setAuthLoading(false)
        }
        checkAuth()
    }, [])

    useEffect(()=>{
        if (authLoading){
            return
        }
        if (!username){
            setTimeout(()=> {
                navigate('/login')
            }, 1000)
            
        }
    }, [username, authLoading])

    if(!authLoading && !username){
        return <h1>you need to login</h1>
    }

    async function handleSubmit(){
        handleAuth()
        if (!title){
            setError('Title can not be empty')
            return
        }
        if (!tentativeRoute){
            setError('Route can not be empty')
            return
        }
        if (!tentativeTime){
            setError('Time can not be empty')
            return
        }



        const reqData = {
            title: title,
            body: body,
            tentativeRoute: tentativeRoute,
            tentativeTime: tentativeTime
        }


        try{
            const res = await axiosInstance.post('/trips/post', reqData)
            setSuccess('Successfully posted')
            setTimeout(()=> {
                navigate('/trips')
            },1000)
            
        }
        catch(e){
            if (Object.hasOwn(e, 'response')){
                setError(e.response.data.error)
            }else{
                setError('server error occured')
            }
            
        }


    }

    function handleRouteSubmit(route){
        setTentativeRoute(route)
    }

    function handleTimeSubmit(time){
        setTentativeTime(time)
    }



    return (
        <>

        <div className="post-trip">

            <Link className='logo-link' to='/trips'>
                <h1 className='logo'><span>Go</span><br></br>together</h1>
            </Link>
            
            <div className="line"></div>

            <h1>Post a trip</h1>

            <div className="fields">

                <input className='title-field' placeholder='Title' type="text" name="title" id="title" value={title} onChange={e => setTitle(e.target.value)} />
                <textarea className='body-field' placeholder='Body' type="text" name="body" id="body" value={body}  onChange={e => setBody(e.target.value)} />

            </div>
            
            <label>Time: {tentativeTime}</label>
            <TimeSelector handleTimeSubmit={handleTimeSubmit}></TimeSelector>
            <p>Route: {tentativeRoute}</p>
            <RouteSelector handleRouteSubmit = {handleRouteSubmit}></RouteSelector>
            <button onClick={handleSubmit}>POST</button>
            {error && <h3>Error: {error}</h3>}
            {success && <h3>Success: {success}</h3>}

        </div>
                

        </>
    )
}
