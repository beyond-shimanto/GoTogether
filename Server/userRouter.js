// users route
// Final routes start with /users/...

import {db, validateAuthentication, JWT_string} from './server.js'
import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'


export const userRouter = express.Router({mergeParams: true})

userRouter.get('/get_username', validateAuthentication, (req, res) => {
    // console.log('\nCONSOLE: Current user being fetched')
    try{
        // console.log('\nCONSOLE: Username fetched')
        res.status(200).json({username: req.body.username})

    }catch(e){
        console.log('\nCONSOLE: Server error while fetching username')
        res.status(500).json({error: 'Server error while fetching username'})
    }
    
})

//Pushing a new user into the database
userRouter.post('/signup', async (req, res) => {
    console.log('\nCONSOLE: new user being created!')

    //checking if the username already exists
    const [usernames, username_fields] = await db.query("SELECT * FROM user WHERE username = ?", [req.body.username.toLowerCase()])
    if (usernames.length >= 1){
        console.log('\nCONSOLE: U already exists')
        res.status(400).json({error: 'User already exists'})
        return
    }

    //checking if email already exists
    const [emails, email_fields] = await db.query("SELECT * FROM user WHERE email = ?", [req.body.email.toLowerCase()])
    if (emails.length >= 1){
        console.log('\nCONSOLE: email already exists')
        res.status(400).json({error: 'The email address is already being used'})
        return
    }
    
    try{
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(req.body.password, salt)
        const username = req.body.username.toLowerCase()
        const email = req.body.email.toLowerCase()
        const date_of_birth = req.body.date_of_birth
        const full_name = req.body.full_name

        const ct = new Date()
        const timeStamp = `${ct.getUTCFullYear()}-${ct.getUTCMonth()}-${ct.getUTCDate()} ${ct.getUTCHours()}:${ct.getUTCMinutes()}:${ct.getUTCSeconds()}`

        const is_verified = 0;
        const is_under_review = 0;

        await db.query('INSERT INTO user (username, email, password_hash, registered_at,is_verified, is_under_review, full_name, date_of_birth) values (?, ?, ?, ?, ?, ?, ?, ?)',
            [username, email, passwordHash, timeStamp, is_verified, is_under_review, full_name,date_of_birth]
        )
        
        console.log('\nCONSOLE: User successfully created')
        res.status(201).json({message: 'User successfully created'})
    }
    catch(e){
        const console_err_msg = `\nCONSOLE: Failed to create user, error: ${e}`
        console.log(console_err_msg)
        res.status(500).json({error: 'Failed to create user'})
    }
    
})

//Login
userRouter.post('/login', async (req, res) => {
    //checking if the user exists
    const [users, users_fields] = await db.query('SELECT username, password_hash FROM user WHERE username = ?', [req.body.username.toLowerCase()])
    if (users.length < 1){
        console.log('\nCONSOLE: The user does not exist')
        res.status(469).json({error: 'Invalid credentials'})
        return
    }
    try{
        const passwordMatch = await bcrypt.compare(req.body.password, users[0].password_hash)
        if(passwordMatch){
            
            const username = req.body.username;
            const password = req.body.password;

            //Sending JWT
            const JTW_token = jwt.sign({username: username, password: password}, JWT_string, { expiresIn: '2h'})
            console.log('\nCONSOLE: Successfully logged in')
            res.json({loginToken: JTW_token})

        }else{
            console.log('\nCONSOLE: wrong password')
            res.status(469).json({error: 'Invalid credentials'})
        }

    }
    catch(e){
        const console_err_msg = `\nCONSOLE: Failed to login, error: ${e}`
        console.log(console_err_msg)    
        res.status(500).json({error: 'Failed to login'})
    }
})




//Ratul's part.......

userRouter.get('/:username/get-reviews', validateAuthentication, async (req, res) => {
    const revieweeUsername = req.params.username
    
    try {
        const [results,fields] = await db.query('SELECT * FROM review WHERE reviewee_username = ?', [revieweeUsername])
        res.status(200).json(results)
    }
    catch(e){
        console.log(e)
        res.status(500).json({message: 'Cound not retrive reviews'})
    }
})

userRouter.get('/:username/get-profile-info', validateAuthentication, async (req, res) => {
    const profileUsername = req.params.username

    try{
        const [results, fields] = await db.query('SELECT username, email, full_name, registered_at, date_of_birth FROM user WHERE username = ?',[profileUsername])
        res.status(200).json(results)
    }
    catch(e){
        console.log(e)
        res.status(500).json({message: 'Failed to retrieve  profile info'})
    }
})