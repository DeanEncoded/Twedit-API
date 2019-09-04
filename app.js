const express = require('express')
const bodyParser = require('body-parser')
const mountRoutes = require('./routes')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({
        info: 'Tweets, but editable'
    })
})
mountRoutes(app)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})