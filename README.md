# Twedit-API
An ExpressJS REST API for the Twitter clone, Twedit.

You can find the repository for the Twedit app [here](https://github.com/DeanEncoded/Twedit).

## API ENDPOINTS
#### data endpoints
*/data/:id/profilephoto* - returns a user's profile photo

#### user authentication
*/auth/login* - logs in a user and returns their user data + access token
FORM DATA: `username, password`

*/auth/signup* - creates a users account and returns their user data + access token
FORM DATA: `name, username, password`

### tweet
*/tweet/new* - allows a user to post a tweet
FORM DATA: `id, access_token, tweet_text`

*/tweet/edit* - allows a user to edit a tweet (Within the first 60 seconds of posting)
FORM DATA: `id, access_token, tweet_id`

*/tweet/delete* - allows a user to delete a tweet
FORM DATA: `id, access_token, tweet_id, tweet_text`

### tweets
*/tweets/all* - returns all tweets available in the tweets table
FORM DATA: `id, access_token`

## Running Twedit-API yourself
If you wish to run the Twedit in your local environment, here are the instructions.
Make sure you have these prerequisites installed:
- **NodeJS (with npm, express and nodemon)**
- **PostgreSQL**

### Setup Postgres database
You'll need to setup a postgres database for the API to use.
Create a postgres database named *twedit* (Or anything else as long as you change it later in the database config)

You'll need only two tables in your database - one for user information and the other for storing tweets.
Here are the queries to easily create these tables (These queries are also available in the **postgres_tables** file in the repository):

```
// users table
CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30),
  username VARCHAR(30),
  password VARCHAR(250),
  access_token VARCHAR(50),
  verified BOOLEAN NOT NULL DEFAULT false
);

// tweets table
CREATE TABLE tweets (
  ID SERIAL PRIMARY KEY,
  tweet_by INT,
  tweet_text VARCHAR(280),
  tweet_time INT,
  edited BOOLEAN NOT NULL DEFAULT false
);
```

Once your database is up and running, clone the repository:
```console
git clone https:\\github.com\DeanEncoded\Twedit-API.git
```

cd into the cloned directory and run `npm install`

**NOTE** : Don't forget to input your postgres connection info in the file `db/index.js`

Once all that's done, just run `npm start` and the api should be up and running at the chosen port (in our case port 3000)

