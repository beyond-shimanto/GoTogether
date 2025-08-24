import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import http from 'http';
import { Server } from 'socket.io';

import { userRouter } from './userRouter.js';
import { tripRouter } from './tripRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

const port = 5000;
export const JWT_string = "ts0lyL2XACun8edj1rjzrp"

export const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Gotogether'
})

const server = http.createServer(app)
export const io = new Server(server, {cors: {origin: "*"}})

//This is mainly used to the the authorization header and check if the user is a valid authenticaed user

export function validateAuthentication(req, res, next){
    //checking if authorization token exists
    if (req.header('Authorization') == null) {
        // console.log('\nCONSOLE: Invalid token provided')        
        return res.status(469).json({error: 'No authentication token found'});
    }
    
    const token = req.header('Authorization').replace('Bearer ', '');

    
    try {
        const decoded_info = jwt.verify(token, JWT_string);
        if (!req.body){
            req.body = {username: decoded_info.username}
        }else{
            req.body.username = decoded_info.username
        }
        // console.log('\nCONSOLE: Login verified')
        next()
    } catch (e) {
        // console.log('\nCONSOLE: Login could not be verified')
        res.status(469).json({error: 'Authorization failed'})
    }
}


// Users route

app.use('/users', userRouter)
app.use('/trips', tripRouter)

//chat web-socket related funcions

io.on('connection', (socket) => {
    console.log('a user has connected to socket ✅')


    socket.on('joinTripChat', (tripId) => {
        socket.join(`tripChat_${tripId}`)
        console.log('someone joined ' + `tripChat_${tripId} ✅`)
    })

    socket.on('disconnect', () => {
        console.log('oh no someone disconnected from socket 😭😭')
    })
})

server.listen(port, () => {
    console.log('CONSOLE: Backend server started!')
})
