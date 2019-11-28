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

router.post('/new', async (req,res) => {
    // let's create a new tweet
    var r = {'success':true}
    const {
        id,
        access_token,
        tweet_text
    } = req.body

    const tokenValid = await db.validateAccessToken(id,access_token);
    if(tokenValid){
        // the access token is valid. let's send out the tweet

        // get current timestamp
        const time = helper.getCurrentTimestamp

        const { rows } = await db.query('INSERT INTO tweets (tweet_by,tweet_text,tweet_time) VALUES($1, $2, $3) RETURNING ID',[id,tweet_text,time])
        if(rows.length > 0){
            // tweet was sent.
            r.tweet_id = rows[0]['id']
            res.status(201).json(r)
        }else{
            r.success = false
            r.message = "Couldn't send tweet. Maybe try again"
            res.status(500).json(r)
        }
    }else{
        r.success = false
        r.message = "Invalid token"
        r.tokenStatus = "invalid"
        res.status(401).json(r)
    }
})

router.delete('/delete', async (req,res) => {
    // let's create a new tweet
    var r = {'success':true}
    const {
        id,
        access_token,
        tweet_id
    } = req.body

    // lets check if the tweet exists
    const tweetExists = await db.verifyTweetExistance(tweet_id)
    if(tweetExists){
        const tokenValid = await db.validateAccessToken(id,access_token);
        const tweetValid = await db.verifyTweetOwnership(id,tweet_id)
        // also check if the tweet is their's... or else they'll be able to delete any tweet.
        if(tokenValid){
            if(tweetValid){
                // delete the tweet
                await db.query('DELETE FROM tweets WHERE ID = $1',[tweet_id],(error,results)=>{
                    if(error){
                        // we have a problem
                        r.success = false
                        r.message = "Something went wrong"
                        res.status(500).json(r)
                    }else{
                        // tweet deleted I guess?
                        r.message = "Tweet deleted"
                        res.status(200).json(r)
                    }
                })
            }else{
                r.success = false
                r.message = "That's not your tweet buddy. Can't fool me"
                res.status(401).json(r)
            }

        }else{
            r.success = false
            r.message = "Invalid token"
            r.tokenStatus = "invalid"
            res.status(401).json(r)
        }
    }else{
        r.success = false
        r.message = "Tweet doesn't exist"
        res.status(404).json(r)
    }
})

router.put('/edit', async (req,res) => {
    // editing a tweet
    var r = {'success':true}
    const {
        id,
        access_token,
        tweet_id,
        tweet_text
    } = req.body

    // lets check if the tweet exists..
    const tweetExists = await db.verifyTweetExistance(tweet_id)
    if(tweetExists){
        const tokenValid = await db.validateAccessToken(id,access_token);
        const tweetValid = await db.verifyTweetOwnership(id,tweet_id)
        const tweetEditable = await db.tweetEditable(tweet_id)

        // also check if the tweet is their's... or else they'll be able to edit any tweet.
        if(tokenValid){
            if(tweetValid){
                // edit the tweet... only if its editable
                if(tweetEditable){
                    await db.query('UPDATE tweets SET tweet_text = $1, edited = TRUE WHERE ID = $2',[tweet_text,tweet_id],(error,results)=>{
                        if(error){
                            // we have a problem
                            r.success = false
                            r.message = "Something went wrong"
                            res.status(500).json(r)
                        }else{
                            // tweet deleted I guess?
                            r.message = "Tweet edited successfully!"
                            res.status(200).json(r)
                        }
                    })
                }else{
                    console.log("WHAT?") // sometimes you just get a little bit confused
                    r.success = false
                    r.message = "Tweet can't be edited"
                    res.status(200).json(r)
                }
            }else{
                r.success = false
                r.message = "That's not your tweet buddy. Can't fool me"
                res.status(200).json(r)
            }

        }else{
            r.success = false
            r.message = "Invalid token"
            r.tokenStatus = "invalid"
            res.status(401).json(r)
        }
    }else{
        r.success = false
        r.message = "Tweet doesn't exist"
        res.status(404).json(r)
    }
})