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

    const[scheduledDay, setScheduledDay] = useState('')
    const[scheduledTime, setScheduledTime] = useState('')

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
        if (tentativeRoute.split(' -> ').length < 2){
            setError('Route can not be empty')
            return
        }
        if (!tentativeTime){
            setError('Time can not be empty')
            return
        }

        let isScheduled = 0
        let postScheduledDateTime = ''

        if (scheduledDay && scheduledTime){

            if (   (!(scheduledTime.split(':').length === 2)) || (!(scheduledDay.split(':').length === 3))  ){
                console.log('here 1')
                setError('Invalid schedule time format')
                return
            }


            if ( (!(!!scheduledDay.split(':')[0].match(/^\d+$/))) || (!(!!scheduledTime.split(':')[0].match(/^\d+$/))) || (!(!!scheduledDay.split(':')[1].match(/^\d+$/))) || (!(!!scheduledTime.split(':')[1].match(/^\d+$/))) || (!(!!scheduledDay.split(':')[2].match(/^\d+$/)))   ) {
                console.log('here 2')
                setError('Invalid schedule time format')
                return
            }

            if (Number(scheduledTime.split[0]) > 24 || Number(scheduledTime.split[0]) < 0 || Number(scheduledTime.split[1]) > 60 || Number(scheduledTime.split[1]) < 0){
                console.log('here 3')
                setError('Invalid schedule time format')
                return
            }

             if (scheduledDay.split[1] > 12 || scheduledTime.split[1] < 0 || scheduledTime.split[2] > 31 || scheduledTime.split[2] < 0){
                console.log('here 4')
                setError('Invalid schedule time format')
                return
            }

            isScheduled = 1
            postScheduledDateTime = `${scheduledDay} ${scheduledTime}:00`

        }


        

        const reqData = {
            title: title,
            body: body,
            tentativeRoute: tentativeRoute,
            tentativeTime: tentativeTime,
            isScheduled: isScheduled,
            postScheduledTime: postScheduledDateTime

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

            <h4>Scheduled Time: (leave empty to post instantly)</h4>

            <input type="text" placeholder='hh:mm' className='scheduled_time_input_field'  value={scheduledTime} onChange={e => {setScheduledTime(e.target.value)}} />
            <input type="text" placeholder='yyyy-mm-dd' className='scheduled_day_input_field' value={scheduledDay} onChange={e => {setScheduledDay(e.target.value)}} />
 
            <button className='btn-post-trip' onClick={handleSubmit}>POST</button>
            {error && <h3>Error: {error}</h3>}
            {success && <h3>Success: {success}</h3>}

        </div>
                

        </>
    )
}
