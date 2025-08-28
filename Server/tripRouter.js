//TRIPS ROUTE
// looks like this /trips/....

import { chatRouter } from './chatRouter.js'
import {db, validateAuthentication} from './server.js'
import express from 'express'



export const tripRouter = express.Router({mergeParams: true})
tripRouter.use('/chat', chatRouter)

//TRIPS INFO GET ROUTES

//Get all trips info
tripRouter.get('', validateAuthentication, async (req, res) => {

    const date = new Date()
    const timeDateString = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')} ${date.getUTCHours()}:${date.getUTCMinutes()}:00`
    

    try{
        const [results, fields] = await db.query('SELECT *, r.route AS route_string, t.id AS trip_id FROM trip t INNER JOIN route r ON t.tentative_route = r.id WHERE (is_scheduled = 0) OR (is_scheduled = 1 AND post_scheduled_time < ?) ORDER BY created_at DESC', [timeDateString])
        res.status(200).json(results)
    }
    catch(e){
        res.status(500).json({error: 'Cound not fetch recent trips'})
    }
    
})


//post a new trip
tripRouter.post('/post', validateAuthentication, async (req, res) => {


    const title = req.body.title
    const body = req.body.body
    const tentativeRoute = req.body.tentativeRoute
    const tentativeTime = req.body.tentativeTime
    const username = req.body.username
    let isScheduled = 0
    let postScheduledTime
    if (req.body.isScheduled == 1){
        isScheduled = req.body.isScheduled
        postScheduledTime = req.body.postScheduledTime
    }

    
    
    const ct = new Date()
    const timeStamp = `${ct.getUTCFullYear()}-${ct.getUTCMonth()}-${ct.getUTCDate()} ${ct.getUTCHours()}:${ct.getUTCMinutes()}:${ct.getUTCSeconds()}`

    try{
        const [routeResult] = await db.query("INSERT INTO route (route) values (?)", [tentativeRoute])

        if (!isScheduled){
            const [tripResult] = await db.query("INSERT INTO trip (created_at, username, title, body, tentative_route, tentative_time) values (?, ?, ? ,?, ?, ?)",
            [timeStamp, username, title, body, routeResult.insertId , tentativeTime]
            )
            res.status(201).json({message: 'Successfully posted trip'})
        }
        else{

            const [tripResult] = await db.query("INSERT INTO trip (created_at, username, title, body, tentative_route, tentative_time, is_scheduled, post_scheduled_time) values (?, ?, ? ,?, ?, ?, ?, ?)",
            [timeStamp, username, title, body, routeResult.insertId , tentativeTime, 1, postScheduledTime]
            )
            res.status(201).json({message: 'Successfully posted trip'})
        }

        

    }
    catch(e){
        res.status(500).json({error: 'Could not post trip'})
    }

})


//get a info a particular trip
tripRouter.get('/:tripId',validateAuthentication, async (req, res) => {
    const tripId = req.params.tripId
    try{
        const [results, fields] = await db.query('SELECT t.id, t.username, t.created_at, t.title, t.body, t.tentative_time, r.route AS tentative_route FROM trip t INNER JOIN route r ON t.tentative_route = r.id WHERE t.id=?', [tripId])
        if (results.length === 0){
            res.status(400).send({error: 'Trip could not be found'})
            return
        }
        res.status(200).send(results)

    }
    catch(e){
        res.status(500).json({error: 'Could not get info about the trip'})
    }
    
   
})

//TRIPS DELETE ROUTES



tripRouter.delete('/:trip_id/delete',validateAuthentication, async (req, res) =>{
    const trip_id = req.params.trip_id
    const username = req.body.username
    let results, results_fields
    try{
        [results, results_fields] = await db.query('SELECT * FROM trip WHERE id = ?', [trip_id])
    }catch(e){
        res.status(500).json({error: 'Could not delete the post'})
    }

    if (!(results[0].username === username)){
        res.status(400).json({error: 'Could not delete the post'})
        return
    }

    try{
        await db.query('DELETE FROM trip WHERE id = ?', [trip_id])
        res.status(200).json({message: 'Successfully deleted the trip'})
    }
    catch(e){
        res.status(500).json({error: 'Could not delete the trip'})
    }

    
})


//TRIPS INFO EDIT ROUTES

tripRouter.put('/:tripId/change-time',validateAuthentication, async (req, res) => {
    const timeString = req.body.timeString
    const username = req.body.username
    const tripId = req.params.tripId


    let results, results_field
    try {
       [results, results_field] = await db.query('SELECT * FROM trip WHERE id = ?', [tripId])
    }
    catch(e){
        res.status(500).json({error: 'Could not change time'})
    }

    if(!(results[0].username === username)){
        res.status(400).json({error: 'Could not change time'})
        return
    }

    try{
        await db.query('UPDATE trip SET tentative_time = ? WHERE id = ?', [timeString,tripId])
        res.status(200).json({message: 'Time changed successfully'})
    }catch(e){
        res.status(500).json({error: 'Could not change time'})
    }


})

tripRouter.put('/:tripId/change-route', validateAuthentication, async (req, res) => {
    const routeId = req.body.routeId
    const username = req.body.username
    const tripId = req.params.tripId


    let results, results_field
    try {
       [results, results_field] = await db.query('SELECT * FROM trip WHERE id = ?', [tripId])
    }
    catch(e){
        res.status(500).json({error: 'Could not change route'})
    }

    if(!(results[0].username === username)){
        res.status(400).json({error: 'Could not change route'})
        return
    }

    try{
        await db.query('UPDATE trip SET tentative_route = ? WHERE id = ?', [routeId,tripId])
        res.status(200).json({message: 'Time changed successfully'})
    }catch(e){
        res.status(500).json({error: 'Could not change time'})
    }
})

//TRIP REPLY RELATED ROUTES

//Create a reply to a particular post

tripRouter.post('/:tripId/create-reply', validateAuthentication, async (req, res) => {
    const parentTripId = req.params.tripId
    const username = req.body.username
    const title = req.body.title
    const body = req.body.body
    const suggestedTime = req.body.suggestedTime
    const suggestedRoute = req.body.suggestedRoute

    let routeId = null;

    const ct = new Date()
    const timeStamp = `${ct.getUTCFullYear()}-${ct.getUTCMonth()}-${ct.getUTCDate()} ${ct.getUTCHours()}:${ct.getUTCMinutes()}:${ct.getUTCSeconds()}`



    try{
        if (suggestedRoute){
            try{
                const [routeResult] = await db.query("INSERT INTO route (route) values (?)", [suggestedRoute])
                routeId = routeResult.insertId;
            }catch(e){
                res.status(500).send({error: 'Could not create route'})
                return
            }
            
        }


        await db.query("INSERT INTO trip_reply (parent_trip_id, username, created_at, title, body, suggested_route, suggested_time) values (?, ?, ?, ?, ?, ?, ?)",
            [
                parentTripId, username, timeStamp, title, body, routeId, suggestedTime
            ]
        )

        res.status(201).json({message: 'Reply added successfully'})

    }
    catch(e){
        res.status(500).json({error: 'Could not create reply'})
    }





})

//Get all replies of a particular post

tripRouter.get('/:tripId/get-replies', validateAuthentication, async (req, res) => {
    const tripId = req.params.tripId
    try {
        const [results, fields] = await db.query(
            'SELECT tr.id AS id, tr.username, tr.created_at, tr.title, tr.body, tr.suggested_time, r.route AS suggested_route, r.id as suggested_route_id FROM trip t INNER JOIN trip_reply tr ON t.id = tr.parent_trip_id LEFT JOIN route r ON tr.suggested_route = r.id WHERE t.id = ? ORDER BY tr.created_at DESC', 
            [tripId]
        )
        res.status(200).json(results)
    }catch(e){
        res.status(500).json({error: 'Could not retrived replies'})
    }
})

//delete a reply

tripRouter.delete('/delete-reply/:reply_id', validateAuthentication, async (req, res) => {
    const username = req.body.username
    const reply_id = req.params.reply_id


    let replies, replies_fields

    try{
        [replies, replies_fields] = await db.query('SELECT * FROM trip_reply WHERE id = ?', [reply_id])
        
    }
    catch(e){
        res.status(500).json({error: 'Could not delete reply'})
        return
    }

    
    
    if (!(username === replies[0].username)){
        res.status(401).json({error: 'This user is not authorized to delete this reply'})
        return
    }

    try{
        await db.query('DELETE FROM trip_reply WHERE id = ?', [reply_id])
    }
    catch(e){
        res.status(500).json({error: 'Could not delete reply'})
    }
    
    res.status(200).send({message: 'The reply has been deleted successfully'})


})

