import './App.css'
import {createBrowserRouter, RouterProvider, Link} from 'react-router-dom'

import { Login } from './components/Login.jsx'
import { Trips } from './components/Trips.jsx'
import { SignUp } from './components/SignUp.jsx'
import { PostTrip } from './components/PostTrip.jsx'
import { TripView } from './components/TripView.jsx'
import { Home } from './components/Home.jsx'

import { useContext } from 'react'
import AuthProvider, { AuthContext } from './AuthContext.jsx'
import { ChatView } from './components/ChatView.jsx'
import { ProfileView } from './components/ProfileView.jsx'
import { PostReview } from './components/PostReview.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home></Home>
  },
  {
    path: '/login',
    element: <Login></Login>
  },
  {
    path: '/signup',
    element: <SignUp></SignUp>
  },

  {
    path: '/trips',
    element: <Trips></Trips>
  },
  {
    path: '/trips/:tripId',
    element: <TripView></TripView>
  },
  {
    path: '/post-trip',
    element: <PostTrip></PostTrip>
  },
  {path: '/trips/:tripId/chat',
    element: <ChatView></ChatView>
  },
  {
    path: '/trips/:tripId/post-review',
    element: <PostReview></PostReview>
  },
  {path: '/profiles/:route_username',
    element: <ProfileView></ProfileView>
  }

])


function App() {


    

  return (

    <AuthProvider>
        <RouterProvider router = {router}>
        </RouterProvider>
    </AuthProvider>
        
  )
}

export default App
