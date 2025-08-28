import React, { useContext, useEffect,useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AuthContext } from '../AuthContext'
import './css/PostReview.css'


export const PostReview = () => {


    const {username, axiosInstance, handleAuth} = useContext(AuthContext)
    const {tripId} = useParams()
    const [chatMembers, setChatMembers] = useState([])

    const [formReviewFor, setFormReviewFor] = useState('')
    const [formReviewRating, setFormReviewRating] = useState(1)
    const [formReviewBody, setFormReviewBody] = useState('')

    const[error, setError] = useState('')
    const [success, setSuccess] = useState('')

    async function getChatMembers(){
        await handleAuth()
        try{
            const chat_members_res = await axiosInstance.get(`trips/chat/${tripId}/get-chat-members`)
            const chat_members_array = []
            for (let m of chat_members_res.data){
                chat_members_array.push(m.username)
            }
            setChatMembers(chat_members_array)
            
        }
        catch(e){
            console.log(e)
        }

    }

    async function handleSubmit(){
        console.log('hello')
    }

    useEffect(()=> {
        getChatMembers()
    }, [])

    if(!chatMembers.includes(username)){
        return <h1>You are not in this chat</h1>
    }


  return (
    <div className='post-review'>
        <Link className='logo-link' to='/trips'>
                <h1 className='logo'><span>Go</span><br></br>together</h1>
            </Link>
        <h1>Post a review</h1>
        <p>for:</p>
        <select onChange={e => {setFormReviewFor(e.target.value)}}>
            <option value='' >None</option>
            {chatMembers.map(cm => {
                return <option key={cm} value={cm} >{cm}</option>
            })}
        </select>
        <br></br>
        Stars:
        <select onChange={e => {setFormReviewRating(Number(e.target.value))}}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>

        <br></br>
        <input type="text" placeholder='Body' value={formReviewBody} onChange={e => {setFormReviewBody(e.target.value)}} />
        <br></br>
        <button onClick={handleSubmit}>Submit</button>
        {error && <h1>{error}</h1>}
        {success && <h1>{success}</h1>}
        
    </div>
  )
}

