//TRIP CHAT RELATED ROUTES


import {db, validateAuthentication, io} from './server.js'
import express from 'express'

export const chatRouter = express.Router({mergeParams: true})


chatRouter.post('/:tripId/create-chat', validateAuthentication, async (req,res) => {
    console.log('we here')
    const parent_trip_id = req.params.tripId
    const username = req.body.username

    try{
        const [trip_results, trip_fields] = await db.query('SELECT username FROM trip WHERE id = ?', [parent_trip_id])
        if (!(trip_results[0].username === username)){
            res.status(400).json({error: 'Could not create chat'})
            return
        }
    }
    catch(e){
        console.log(e)
        res.status(500).json({error: 'Could not create chat'})
        return

    }

    try{
        await db.query('INSERT INTO chat_box (parent_trip_id) values (?)',[parent_trip_id])
        res.status(200).json({message: 'Successfully created chat'})
    }
    catch(e){
        console.log(e)
        res.status(500).json({error: 'Could not create chat'})
    }
})

chatRouter.get('/:tripId/get-chat', validateAuthentication, async (req,res) => {
    const parent_trip_id = req.params.tripId

    try{
        const [results, fields] = await db.query('SELECT * FROM chat_box WHERE parent_trip_id = ?', [parent_trip_id])
        res.status(200).json(results)
    }
    catch(e){
        res.status(500).json({error: 'Could not retrieve chat'})
    }
})


chatRouter.get('/:tripId/get-chat-members', validateAuthentication, async (req, res) => {
    const tripId = req.params.tripId
    try{
        const [results, fields] = await db.query('SELECT username FROM chat_enrollment WHERE parent_trip_id = ?',[tripId])
        res.status(200).json(results)
    }
    catch(e){
        res.status(500).json({error: 'Could not get chat members'})
    }
})

chatRouter.post('/:tripId/add-chat-member', validateAuthentication, async (req, res) => {
    const username = req.body.username
    const tripId = req.params.tripId
    const toBeAddedUsername = req.body.toBeAddedUsername

    try{
        const [trip_results, trip_fields] = await db.query('SELECT username FROM trip WHERE id = ?', [tripId])
        if (!(trip_results[0].username === username)){
            res.status(400).json({error: 'Could not add member'})
            return
        }
    }
    catch(e){
        console.log(e)
        res.status(500).json({error: 'Could not add member'})
        return

    }

    try {
        await db.query('INSERT INTO chat_enrollment (parent_trip_id, username) values (?,?)', [tripId, toBeAddedUsername])
        res.status(201).json({message: 'Successfully added the member to the chat'})
    }catch(e){
        console.log(e)
        res.status(500).send({error: 'Could not add member'})
    }
    

})

chatRouter.post('/:tripId/add-text', validateAuthentication, async (req, res) => {
    const username = req.body.username
    const text = req.body.text
    const tripId = req.params.tripId

    try{
        await db.query('INSERT INTO chat_text (parent_trip_id, username, body) values (?,?,?)', [tripId, username, text])
        //emitting throught socket.io that a new text has been sent
        io.to(`tripChat_${tripId}`).emit('newText')
        res.status(200).json({message: 'Text successfully sent'})
    }catch(e){
        res.status(500).json({error: 'Could not send text'})
    }
    
    


})

chatRouter.get('/:tripId/get-texts', validateAuthentication, async (req, res) => {
    const tripId = req.params.tripId
    try{
        const [texts_results, fields] = await db.query('SELECT id, username, body FROM chat_text WHERE parent_trip_id = ? ORDER BY created_at', [tripId])
        res.status(200).json(texts_results)

    }catch(e){
        res.status(500).json({error: 'Could not retrive the chats'})
    }
})