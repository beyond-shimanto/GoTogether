import React, { useContext, useEffect, useState } from 'react'
import { useParams ,useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../AuthContext'
import { RouteSelector } from './RouteSelector'
import TimeSelector from './TimeSelector'
import './css/TripView.css'


export const TripView = () => {

    const {username, axiosInstance, handleAuth} = useContext(AuthContext)
    const navigate = useNavigate()


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
   


    const {tripId} = useParams()
    const [trip, setTrip] = useState([])
    const [chatMembers, setChatMembers] = useState([])
    const [replyFormTitle, setReplyFormTitle] = useState('')
    const [replyFormBody, setReplyFormBody] = useState('')
    const [replyFormSuggestedTime, setReplyFormSuggestedTime] = useState('')
    const [replyFormSuggestedRoute, setReplyFormSuggestedRoute] = useState('')
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [tr, setTr] = useState([])

    const [replyFieldsContainerExpansionClass, setReplyFieldsContainerExpansionClass] = useState('reply-fields-container')
    const [svgRotateClass, setSvgRotateClass] = useState('')


    async function getTripInfo(){
        await handleAuth()
        try{
        const res = await axiosInstance.get(`trips/${tripId}`)
        setTrip(res.data[0])
        }
        catch(e){
            console.log(e)
        }
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

        


    useEffect(() => {
        
        getTripInfo()
        
    },[])

    async function getTripReplies(){
        await handleAuth()
        try{
            const res = await axiosInstance.get(`trips/${tripId}/get-replies`)                
            setTr(res.data)

            
        }
        catch(e)
        {
            console.log(e)
            setError('Could not fetch replies')
        }
    }



     async function handleReplySubmit(){
        await handleAuth()
        if (!replyFormTitle){
            setSuccess('')
            setError('Title can not be empty')
            return
        }

        try{
            const reqData = {
                title: replyFormTitle,
                body: replyFormBody,
                suggestedTime: replyFormSuggestedTime,
                suggestedRoute : replyFormSuggestedRoute
            }
            const res = await axiosInstance.post(`trips/${tripId}/create-reply`, reqData)
            getTripReplies()
        }
        catch(e){
            console.log(e)
            setError('could not submit')
            return

        }

        setError('')
        setSuccess('Submitted')



    }


    async function handleReplyDelete(reply_id){
        await handleAuth()
        try{
            const res = axiosInstance.delete(`trips/delete-reply/${reply_id}`)
            getTripReplies()
        }catch(e){
            setError('Could not delete the reply')
        }
        

    }

    async function handleTripTimeChange(time){
        handleAuth()
        try{

            const reqData = {
                timeString: time
            }
            const res = axiosInstance.put(`trips/${tripId}/change-time/`, reqData)
            getTripInfo()
            setSuccess('Time updated! ')
        }catch(e){
            setError('could not change time')
        }
    }

    async function handleTripRouteChange(routeId){
        try{
            const reqBody = {
                routeId: routeId
            }
            const res = await axiosInstance.put(`trips/${tripId}/change-route`, reqBody)
            getTripInfo()
            setSuccess('Changed the route')
        }
        catch(e){
            setError('Could not change route')
        }
    }

    function handleRouteSubmit(route){
        setReplyFormSuggestedRoute(route)
    }

    function handleTimeSubmit(time){
        setReplyFormSuggestedTime(time)
    }

    async function handleAddToRideChat(add_username){
        handleAuth()
        try{
            const reqData = {
                toBeAddedUsername: add_username
            }
            const res = await axiosInstance.post(`trips/chat/${tripId}/add-chat-member`, reqData)
            getTripInfo()
            getTripReplies()


        }
        catch(e){
            console.log(e)
        }
    }

    function toggleReplyFieldsContainerExpansionClass(){

        setSvgRotateClass(
            oldValue => {
                if (oldValue === ''){
                    return 'rotate'
                }else{
                    return ''
                }
            }
        )


        setReplyFieldsContainerExpansionClass(
            oldValue => {
                if(oldValue === 'reply-fields-container'){
                    return 'reply-fields-container show'
                }else{
                    return 'reply-fields-container'
                }
            }
        )
    }

    useEffect(() => {
        
        getTripReplies()
    }, [])





    if(!authLoading && !username){
        return <h1>you need to login</h1>
    }

    

    return (
        <>

            <div className="trip-view">

                <Link className='logo-link' to='/trips'>
                        <h1 className='logo'><span>Go</span><br></br>together</h1>
                </Link>
                            
                <div className="line"></div>

                <div className="row">
                    <h1>{trip.title}</h1>
                    {chatMembers.includes(username) && <Link className='btn btn-confirm' to={`/trips/${tripId}/chat`}>View Ride Chat</Link>}
                    {((trip.username === username) && (chatMembers.length === 0)) && <button className='btn btn-confirm' onClick={e => handleAddToRideChat(username)}> Confirm Ride </button>}
                </div>
                
                <div className="row">
                    <svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>profile_round [#ffffff]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -2159.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598" id="profile_round-[#ffffff]"> </path> </g> </g> </g> </g></svg>
                    <h3>{trip.username}</h3>
                </div>
                
                

                <div className="row">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M4 10.1433C4 5.64588 7.58172 2 12 2C16.4183 2 20 5.64588 20 10.1433C20 14.6055 17.4467 19.8124 13.4629 21.6744C12.5343 22.1085 11.4657 22.1085 10.5371 21.6744C6.55332 19.8124 4 14.6055 4 10.1433Z" stroke="#ffffff" strokeWidth="1.5"></path> <circle cx="12" cy="10" r="3" stroke="#ffffff" strokeWidth="1.5"></circle> </g></svg>
                        <h4>{trip.tentative_route}</h4>
                </div>
                
                <div className="row">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 6V12" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M16.24 16.24L12 12" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                    <h4>Time: {trip.tentative_time}</h4>
                </div>

                <h4>{trip.created_at && trip.created_at.split('.000Z')[0].split('T')[0]}</h4>
                <h4>{trip.created_at && trip.created_at.split('.000Z')[0].split('T')[1]}</h4>

                <div className="body-container">
                {!trip.body && <p className='grey-text'>Poster has not provided a body</p>}
                {trip.body && <p>{trip.body}</p>}
                </div>


                

                <div className="row add-reply-row">
                    <h1>Add a reply</h1>
                    <button className='btn' onClick={e => {toggleReplyFieldsContainerExpansionClass()}}>
                        <svg className={svgRotateClass} viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" fill="#ffffff"></path></g></svg>     
                    </button>
                </div>
                
                <div className={replyFieldsContainerExpansionClass}>
                    <div className="fields">
                        <input type="text" placeholder='Title' value={replyFormTitle} onChange={e => {setReplyFormTitle(e.target.value)}} />
                        <textarea type="text" placeholder='Body' value={replyFormBody} onChange={e => {setReplyFormBody(e.target.value)}} />
                    </div>
                    
                    <label>Suggested Time:{replyFormSuggestedTime}</label>
                    <TimeSelector handleTimeSubmit = {handleTimeSubmit}></TimeSelector>
                    {replyFormSuggestedRoute && <p>Selected route: {replyFormSuggestedRoute}</p>}
                    <RouteSelector handleRouteSubmit={handleRouteSubmit}></RouteSelector>
                    <button onClick={handleReplySubmit}>Submit</button>
                </div>
                
                {success && <h1>{success}</h1>}
                {error && <h1>{error}</h1>}

                {(tr.length === 0) && <h3>No replies yet  </h3>}

                <div className="replies-container">

                    {tr.map(trr => {
                    return <TripReply key={trr.id} trr={trr} username={username} trip={trip} handleTripRouteChange={handleTripRouteChange}
                    handleTripTimeChange = {handleTripTimeChange} handleAddToRideChat = {handleAddToRideChat}
                    handleReplyDelete = {handleReplyDelete} chatMembers={chatMembers}
                    ></TripReply>
                    })}


                </div>

                
            </div>
            


            


        </>
        

    )
}

function TripReply({trr, username, trip, handleTripRouteChange, handleTripTimeChange, handleAddToRideChat, handleReplyDelete, chatMembers }){

    const suggestedRoute = trr.suggested_route
    const suggestedRouteId = trr.suggested_route_id
    const suggestedTime = trr.suggested_time


    const [deleteBtnClass, setdeleteBtnClass] = useState('btn btn-delete')
    const [addToChatBtnClass, setAddToChatBtnClass] = useState('btn btn-add-to-chat')

    function handleMouseEnter(){
        setdeleteBtnClass('btn btn-delete show')
        setAddToChatBtnClass('btn btn-add-to-chat show')
    }
    function handleMouseLeave(){
        setdeleteBtnClass('btn btn-delete')
        setAddToChatBtnClass('btn btn-add-to-chat')
    }

    return <div className='reply-container' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                
                <SuggestionBox suggestedTime={suggestedTime} trr = {trr} username={username} handleTripTimeChange = {handleTripTimeChange} handleTripRouteChange={handleTripRouteChange} trip={trip} ></SuggestionBox>
                <SuggestionBox suggestedRoute={suggestedRoute} suggestedRouteId={suggestedRouteId} trr = {trr} username={username} handleTripTimeChange = {handleTripTimeChange} handleTripRouteChange={handleTripRouteChange} trip={trip} ></SuggestionBox>

                <div className="row">
                    <h3>Reply: {trr.title}</h3>
                    {username === trr.username && <button className={deleteBtnClass} onClick={e => {handleReplyDelete(trr.id)}}>
                        <svg viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>delete [#1487]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -360.000000)" fill="#ff0000ff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z" id="delete-[#1487]"> </path> </g> </g> </g> </g></svg>
                    </button>}

                </div>
                <div className="line"></div>
                <div className="row">
                    <svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>profile_round [#ffffff]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -2159.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598" id="profile_round-[#ffffff]"> </path> </g> </g> </g> </g></svg>
                    <p>{trr.username}</p>
                    {((trip.username === username) && (chatMembers.length > 0) && (!chatMembers.includes(trr.username))) && <button className={addToChatBtnClass} onClick={e => {handleAddToRideChat(trr.username)}}>Add to Ride Chat</button> }

                </div>
                
                <p>{trr.body}</p>
                {suggestedRoute && <p>Suggested Route: {suggestedRoute}</p>}
                
            </div>

    
}

function SuggestionBox({suggestedTime, suggestedRoute, suggestedRouteId, trr, username, handleTripTimeChange, handleTripRouteChange, trip}){


    const [acceptButtonClass, setAcceptButtonClass] = useState('btn btn-accept')
    function handleMouseEnter(){
        setAcceptButtonClass('btn btn-accept show')
    }

    function handleMouseLeave(){
        setAcceptButtonClass('btn btn-accept')
    }

    return(
        <>
        
            {suggestedTime && 
            <>
            <div className='suggestion' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 16.99V17M12 7V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#ffb732" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                <h4>{trr.username} has suggested a new timing: <b> {suggestedTime}</b> </h4>
                {trip.username === username && <button className={acceptButtonClass} onClick={e => handleTripTimeChange(suggestedTime)}>Accept</button>}
                </div>
            
            </>}

            {suggestedRoute &&
            <>
            <div className='suggestion' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}> 
            
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 16.99V17M12 7V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#ffb732" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                <h4>{trr.username} has suggseted a new route: <b>{suggestedRoute}</b> </h4>
                {trip.username === username && <button className={acceptButtonClass} onClick={e => handleTripRouteChange(suggestedRouteId)}>Accept</button>}
            
            </div>


            
            </>}


        </>
    )

}
