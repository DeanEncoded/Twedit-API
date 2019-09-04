const Pool = require('pg').Pool
const helper = require('../helper')

const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'twedit',
    password: 'password',
    port: 5432,
})

// access token validator
async function validateAccessToken(id,token){
  const { rows } = await pool.query("SELECT access_token FROM users WHERE ID = $1",[id])
  const accessToken = rows[0]['access_token']
  if(accessToken == token) return true
  else return false
}

// tweet ownership verification
async function verifyTweetOwnership(user_id,tweet_id){
  const { rows } = await pool.query("SELECT tweet_by FROM tweets WHERE ID = $1",[tweet_id])
  const tweet_by = rows[0]['tweet_by']
  if(tweet_by == user_id) return true
  else return false
}

// is a tweet editable or not?
// a tweet is only editable in the first 60 seconds of it being posted.
// the client should also have their own handle to this.
async function tweetEditable(tweet_id){
  const { rows } = await pool.query("SELECT tweet_time FROM tweets WHERE ID = $1",[tweet_id])
  const tweet_time= rows[0]['tweet_time']
  // get the current time now
  const time_now = helper.getCurrentTimestamp
  
  // remove 60 seconds from time_now...
  // if that value is less than tweet_time. Allow the edit. If not.. then don't
  if((time_now - 60) < tweet_time){
    return true
  }else{ return false }
 
}

// verify if tweet exists (with ID)(might use UID's later)
async function verifyTweetExistance(tweet_id){
  const { rowCount } = await pool.query("SELECT ID FROM tweets WHERE ID = $1",[tweet_id])
  if(rowCount) return true
  else return false
}

module.exports = {
    query: (text, params, callback) => {
      return pool.query(text, params, callback)
    },
    validateAccessToken,
    verifyTweetOwnership,
    verifyTweetExistance,
    tweetEditable
}