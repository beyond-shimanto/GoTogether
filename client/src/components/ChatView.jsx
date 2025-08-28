import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthContext'
import { useParams, useSearchParams } from 'react-router-dom'
import {io} from 'socket.io-client'

import './css/ChatView.css'

export const ChatView = () => {

  const {username, axiosInstance, handleAuth} = useContext(AuthContext)
  const {tripId} = useParams()
  const [chatMembers, setChatMembers] = useState([])
  const [texts, setTexts] = useState([])
  const [textBoxText, setTextBoxText] = useState('')
  const [socket, setSocket] = useState(null)
  const [desc, setDesc] = useState('')

  async function handleTextSend(){
    handleAuth()
    if (!textBoxText.trim()){
      return
    }
    try{
      const reqData = {
        text: textBoxText
      }
      const res = await axiosInstance.post(`trips/chat/${tripId}/add-text`, reqData)
      setTextBoxText('')
      

    }catch(e){
      console.log(e)
    }
  }

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

  async function getTexts(){
    try{
      const res = await axiosInstance.get(`trips/chat/${tripId}/get-texts`)
      setTexts(res.data)
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    const newSocket = io('http://localhost:5000')
    setSocket(newSocket)

    newSocket.on('connect', ()=> {
      console.log('CONSOLE: (SOCKET) CONNECTED TO SOCKET SERVER')

      newSocket.emit('joinTripChat', tripId)
      newSocket.on('newText', ()=> {
        getTexts()
      })


    })

    return() => newSocket.disconnect()
  }, [])

  useEffect(() => {
    handleAuth()
    getChatMembers()
    getTexts()
    }
  , [])


  if(!chatMembers.includes(username)){
    return <h1>You are not in this chat!</h1>
  }


  return (
    <>

    <div className="chat-view">
          <div className="header">Trip Chat</div>
          <div className="texts-container">
             {texts.map( t => {
              return <div className={username == t.username? "text-container self": "text-container"}>
                <div className= "text-username-container">   
                  {t.username}
                </div>
                <span>:</span>
                <div className="text-body-container">
                  {t.body}
                </div>
              </div>
            })}
          </div>

          <div className="chat-fields-container">
            <input type="text" placeholder='Text' onChange={e => setTextBoxText(e.target.value)} value={textBoxText}/>
            <button onClick={handleTextSend}>send</button>
          </div>
          

            

    </div>
    

    </>
  )
}

