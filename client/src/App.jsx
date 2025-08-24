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
