import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../AuthContext'

import './css/Trips.css'


  const areas = [
  "Motijheel",
  "Gulshan",
  "Banani",
  "Uttara",
  "Mirpur",
  "Dhanmondi",
  "Shahbagh",
  "Farmgate",
  "Mohammadpur",
  "Old Dhaka"
];

export const Trips = () => {
    

    const [trips, setTrips] = useState([])
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const {username, axiosInstance, handleAuth} = useContext(AuthContext)


    const [authLoading, setAuthLoading] = useState(true)



    const [fliterStartTimeHours, setfilterStartTimeHours] = useState('')
    const [filterStartTimeMinutes, setFilterStartTimeMinutes] = useState('')
    const [fliterEndTimeHours, setFilterEndTimeHours] = useState('') 
    const [filterEndTimeMinutes, setFilterEndTimeMinutes] = useState('')
    const [filterPlace, setFilterPlace] = useState('')

    useEffect(()=> {

        if (Number(fliterStartTimeHours) < 0){
            setfilterStartTimeHours('')
        }
        if (Number(filterStartTimeMinutes) < 0){
            setFilterStartTimeMinutes('')
        }
        if (Number(fliterEndTimeHours) < 0){
            setFilterEndTimeHours('')
        }
        if (Number(filterEndTimeMinutes) < 0){
            setFilterEndTimeMinutes('')
        }


        if (Number(fliterStartTimeHours) > 24){
            setfilterStartTimeHours('24')
        }
        if (Number(filterStartTimeMinutes) > 69){
            setFilterStartTimeMinutes('60')
        }
        if (Number(fliterEndTimeHours) > 24){
            setFilterEndTimeHours('24')
        }
        if (Number(filterEndTimeMinutes) > 60){
            setFilterEndTimeMinutes('60')
        }

        getTrips()

    }, [fliterStartTimeHours, filterStartTimeMinutes, fliterEndTimeHours, filterEndTimeMinutes, filterPlace])





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


    
    async function getTrips(){
        await handleAuth()
        try{
            const res = await axiosInstance.get('/trips')
            

            if (Array.isArray(res.data)){
                const trip_data = res.data.filter(t => {
                    if (filterPlace && !(t.route_string.split(' -> ').includes(filterPlace))){
                        return false
                    }
                    if (fliterStartTimeHours && filterStartTimeMinutes && fliterEndTimeHours && filterEndTimeMinutes){
                        const [t_hour,t_minute] = t.tentative_time.split(':')
                        if (Number(t_hour) > Number(fliterEndTimeHours) || Number(t_hour) < Number(fliterStartTimeHours)){
                            return false
                        }
                        if ((Number(t_hour) == Number(fliterEndTimeHours) && Number(t_minute) > Number(filterEndTimeMinutes)) || (Number(t_hour) == Number(fliterStartTimeHours) &&  Number(t_minute) < Number(filterStartTimeMinutes))){
                            return false
                        }
                    }
                

                return true
                })

                setTrips(trip_data)
            }
            else{
                setTrips(res.data)
            }   
            

            
        }
        catch(e){

            console.log(e)

            if(Object.hasOwn(e, 'response')){
                setError(e.response.data.error)
            }
            else{
                setError('Server error occured')
            }
        }
        
    }

    async function handleTripDelete(trip_id){
        await handleAuth()
        try{
            const res = await axiosInstance.delete(`trips/${trip_id}/delete`)
            getTrips()
        }catch(e){
            setError('Could not delete trip')
        }
    }

    useEffect(()=> {
        getTrips()
    },[])


    if(!authLoading && !username){
        return <h1>you need to login</h1>
    }

    return (
    <>

        <div className="trips">
            <div className="header">
                <Link className='logo-link' to ='/trips'>
                    <h1 className='logo'><span>Go</span><br></br>together</h1>
                </Link>
                <Link className='btn btn-1' to='/post-trip'>New trip</Link>
                <Link className='pfp-btn' to = {`/profiles/${username}`} >
                    <svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>profile_round [#ffffff]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -2159.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598" id="profile_round-[#ffffff]"> </path> </g> </g> </g> </g></svg>
                </Link>
            </div>
            {error && <h3>Error: {error}</h3>}


            <div className="secondary-header">
                <h1>Trip listing:</h1>
                <div className="filter-input-fields">
                    <h4>filters: </h4>
                    <p>Start Time:</p>
                    <input type="number" value={fliterStartTimeHours} placeholder='00' onChange={e => {setfilterStartTimeHours(e.target.value)}}/>
                    <span>:</span>
                    <input type="number" placeholder='00' value={filterStartTimeMinutes} onChange={e => {setFilterStartTimeMinutes(e.target.value)}} />
                    <p>End Time:</p>
                    <input type="number" value={fliterEndTimeHours} placeholder='00' onChange={e => {setFilterEndTimeHours(e.target.value)}} />
                    <span>:</span>
                    <input type="number" value={filterEndTimeMinutes} placeholder='00' onChange={e => {setFilterEndTimeMinutes(e.target.value)}}/>
                    <p>place:</p>
                    <select onChange={e => {setFilterPlace(e.target.value)}} >
                        <option value="" >None</option>
                        {areas.map(a => {
                            return <option key={a} value={a}>{a}</option>
                        })}
                    </select>
                </div>
            </div>
            
            <div className="trips-container">

                {trips.map(t => {
                    
                    return <Trip key={t.id} t={t} username={username} handleTripDelete={handleTripDelete}></Trip>
                })}
            </div>
            

        </div>
        
        
        
    </>
    
    )
}

const Trip = ({t, username, handleTripDelete}) => {

    const [btnsContainerClass, setBtnsContainerClass] = useState('btns-container')
    const [create_time, create_date] = t.created_at.split('.000Z')[0].split('T')

    function handleMouseEnter(){
        setBtnsContainerClass('btns-container show')
    }

    function handleMouseLeave(){
        setBtnsContainerClass('btns-container')
    }
    
    
    return <div  className='trip-container' onMouseEnter={e => {handleMouseEnter()}} onMouseLeave={e => {handleMouseLeave()}}>
                <h3>{t.title}</h3>
                <div className="line"></div>
                <div className="row">
                    <svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>profile_round [#ffffff]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -2159.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598" id="profile_round-[#ffffff]"> </path> </g> </g> </g> </g></svg>
                    <Link to={`/profiles/${t.username}`}>{t.username}</Link>
                </div>
                <div className="row">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M4 10.1433C4 5.64588 7.58172 2 12 2C16.4183 2 20 5.64588 20 10.1433C20 14.6055 17.4467 19.8124 13.4629 21.6744C12.5343 22.1085 11.4657 22.1085 10.5371 21.6744C6.55332 19.8124 4 14.6055 4 10.1433Z" stroke="#ffffff" strokeWidth="1.5"></path> <circle cx="12" cy="10" r="3" stroke="#ffffff" strokeWidth="1.5"></circle> </g></svg>
                    <p>{t.route_string}</p>
                </div>
                
                <div className="row">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 6V12" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M16.24 16.24L12 12" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                    <p>{t.tentative_time}</p>
                </div>
                <p>{create_date}</p>
                <p>{create_time}</p>
                <p>{t.body}</p>
                <div className={btnsContainerClass}>
                    <Link className='btn-view-trip' to={`/trips/${t.trip_id}`}>
                    
                    <h4>View trip</h4>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L13.7071 19.7071C13.3166 20.0976 12.6834 20.0976 12.2929 19.7071C11.9024 19.3166 11.9024 18.6834 12.2929 18.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H17.5858L12.2929 5.70711C11.9024 5.31658 11.9024 4.68342 12.2929 4.29289Z" fill="#000000"></path> </g></svg>
                    </Link>
                    <br></br>
                    {username === t.username && <button className='btn-delete' onClick={e => {handleTripDelete(t.trip_id)}}>
                        <h4>Delete</h4>
                        <svg viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>delete [#1487]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -360.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z" id="delete-[#1487]"> </path> </g> </g> </g> </g></svg>
                        </button>}
                </div>
            

            </div>

}


