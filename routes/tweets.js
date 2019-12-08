const bcrypt = require('bcryptjs');
const helper = require('../helper')
const Router = require('express-promise-router')
const db = require('../db')

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()
// export our router to be mounted by the parent application
module.exports = router

router.post('/all', async (req,res) => {
    // Get all tweets
    var r = {'success':true}
    const {
        id,
        access_token
    } = req.body

    const tokenValid = await db.validateAccessToken(id,access_token);
    if(tokenValid){
        // the access token is valid.
        // this user is able to get tweets

        const { rows } = await db.query('SELECT tweets.id, tweets.tweet_by, tweets.tweet_text, tweets.tweet_time, tweets.edited, users.username,users.name FROM tweets, users WHERE users.id = tweets.tweet_by ORDER BY tweets.id DESC;')
        if(rows.length > 0){
            // we have some tweets
            r.tweets = rows
            res.status(200).json(r)
        }else{
            // no tweets

            r.success = false
            r.message = "No tweets available yet"
            res.status(500).json(r)
        }
    }else{
        r.success = false
        r.message = "Invalid token"
        r.tokenStatus = "invalid"
        res.status(401).json(r)
    }
})