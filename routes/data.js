const bcrypt = require('bcryptjs');
const helper = require('../helper')
const Router = require('express-promise-router')
const db = require('../db')
var path = require('path');
var fs = require('fs')

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()
// export our router to be mounted by the parent application
module.exports = router


router.get('/:id/profilephoto', async (req, res) => {
    // send the profile photo
    // BUT WE SHOULD ALSO TRY DO SOMETHING ABOUT EXTENSIONS. WHAT IF A USER UPLOADS AN IMAGE WITH A DIFFERENT FILE EXTENSION?
    const id = req.params.id
    var photoPath = path.resolve(__dirname + "/../data/profile_photos/" + id + ".jpg")
    if (fs.existsSync(photoPath)) {
        res.sendFile(photoPath)
    }else{
        res.status(404).send("No data")
    }
})