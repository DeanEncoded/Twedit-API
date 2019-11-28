const bcrypt = require('bcryptjs');
const helper = require('../helper')
const Router = require('express-promise-router')
const db = require('../db')
var fs = require('fs') // for handling data files such as photos
var path = require('path'); //

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()
// export our router to be mounted by the parent application
module.exports = router

router.post('/signup', async (req,res) => {
    var r = {'success':true}
    const {
        name,
        username,
        password
    } = req.body

    // checking whether the username exists
    const { rows } = await db.query('SELECT name FROM users WHERE username = $1',[username])
    if(rows < 1){
        // the username is free
        var pwdsalt = bcrypt.genSaltSync(10)
        var hashedpass = bcrypt.hashSync(password, pwdsalt)

        const accessToken = helper.generateToken(20)

        try{
            const { rows } = await db.query('INSERT INTO users (name, username, password, access_token) VALUES ($1, $2, $3, $4) RETURNING *', [name, username, hashedpass, accessToken])
            // if there is one row the user was created
            if(rows.length > 0){
                // go ahead and send the user their data

                const userID = rows[0]["id"]

                // copy the default profile photo and set it as this users photo in data/profile_photos
                // this is not a good system of handling profile photos
                fs.createReadStream(path.resolve(__dirname + "/../data/profile_photos/default_photo.jpg")).pipe(fs.createWriteStream(path.resolve(__dirname + "/../data/profile_photos/" + userID + ".jpg")))

                var userdata = rows[0]
                delete(userdata['password']) // removing password from userdata
                r.userdata = userdata
                res.status(200).json(r)
            }
        }catch(error){
            console.log(error)
            req.status(500).send("Not looking too good. Couldn't create your account")
        }
    }else{
        // username is already in use
        r.success = false
        r.message = "That username is taken"
        res.status(200).json(r)
    }
})

router.post('/login', async (req,res) => {
    var r = {'success':true}
    const {
        username,
        password
    } = req.body

    async function updateAccessToken(token,username){
        try{
            const { rowCount } = await db.query('UPDATE users SET access_token = $1 WHERE username = $2 RETURNING ID;', [token,username])
            console.log(rowCount)
            if (rowCount> 0) return true
        }catch(error){
            console.log(error)
            return false
        }
    }

    db.query('SELECT * FROM users WHERE username = $1', [username], (error, results) => {
        if (error || results.rows == 0) {
           r.success = false
           if(results.rows == 0) r.message = "That user doesn't exist."
           else r.message = "Something went wrong back here. Can you try again?"
           res.status(200).json(r) // these responses can be handled quite better than this
        }else{
            // the user does exist
            // check their password authenticity
            if(bcrypt.compareSync(password, results.rows[0]['password'])){
                // the user can login
                // generate an access token, update it the users table entry and send it to them
                const accessToken = helper.generateToken(20)

                // updating the access token
                if(updateAccessToken(accessToken,username)){
                    // we're good
                    var userdata = results.rows[0]
                    userdata['access_token'] = accessToken // updating the token
                    delete(userdata['password']) // removing password from userdata
                    r.userdata = results.rows[0]
                    res.status(200).json(r)
                }else{
                    // something went wrong
                    r.success = false;
                    r.message = "Something went wrong. Try again maybe?"
                    res.status(500).json(r)
                }
            }else{
                // password is incorrect
                r.success = false;
                r.message = "Password is incorrect."
                res.status(200).json(r)
            }
        }
    })
   
})


router.get('/test', async (req,res) => {
    try{
        const { rows } = await db.query('SELECT * FROM users')
        console.log(rows)
        res.status(200).json(rows)
    }catch(error){
        console.log(error)
        res.status(500).send("Hmmm...")
    }
})