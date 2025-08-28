import React, { useContext,useEffect,useState } from 'react'
import {Link, useParams, useNavigate} from 'react-router-dom'
import { AuthContext } from '../AuthContext';
import './css/ProfileView.css'

export const ProfileView = () => {
    
    const {route_username} = useParams();
    const {username, axiosInstance, handleAuth, handleLogout} = useContext(AuthContext)

    const [authLoading, setAuthLoading] = useState(true)

    const [profileInfo, setProfileInfo] = useState([{full_name: 'Mr. Meow Uddin', username: 'meowmeow', email: 'Simanto48@gmail.com', date_of_birth: '18-19-20', registed_at: '18-19-20'}])
    
    const navigate = useNavigate()

    function getProfileInto(){
        console.log('geting profile info lmao')
    }

    function handleLogoutBtnClick(){
        handleLogout()
        navigate('/login')
    }

    
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

    useEffect(() => {

    })
    
    
    if(!authLoading && !username){
    return <h1>you need to login</h1>
    }

  return (
    <div className="profile-view">

        <div className="header">
            <Link className='logo-link' to ='/trips'>
                <h1 className='logo'><span>Go</span><br></br>together</h1>
            </Link>
            <button className='btn btn-log-out' onClick={handleLogoutBtnClick} >
                Log out
            </button>
        </div>


        <div className="row">
            <div className="names-container">
                <h2>{profileInfo[0].full_name}</h2>
                <p>{profileInfo[0].username}</p>
            </div>
            <svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>profile_round [#ffffff]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -2159.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598" id="profile_round-[#ffffff]"> </path> </g> </g> </g> </g></svg>
        </div>

        <p>Member since: {profileInfo[0].registed_at}</p>
        <p>Member since: {profileInfo[0].date_of_birth}</p>
        <p>Member since: {profileInfo[0].email}</p>
    </div>
  )
}
