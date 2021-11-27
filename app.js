const express = require('express');
const app = express();
const mongoose = require('mongoose');;
const config = require('./config')
// const fileUpload = require('express-fileupload');
const cors = require('cors')
const cookieParser = require("cookie-parser");
const session = require('express-session');
const multer = require("multer");
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');
const commentsRoute = require('./routes/comments');
const MongoStore = require('connect-mongo')(session);




app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: false,
    cookie: { 
        secure: false,  
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly:true
     },
    resave: false,
    store: new MongoStore({mongooseConnection:mongoose.connection})
}));



// app.use(multer({dest:'./uploads/'}).single('profilePicture'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(fileUpload());
app.use(express.static(__dirname + '/public'))
app.use(cors())
app.use(cookieParser());
app.use(bodyParser.json());

//set views
app.set('views', './views')
app.set('view engine', 'ejs')



//routes
app.get('/', cors(), async (req,res) => {

    res.render('index.ejs',{"msg":"mes"})
})
app.use('/api/auth',cors(),authRoute);
app.use('/api/users',cors(),usersRoute);
app.use('/api/posts',cors(),postsRoute);
// app.use('/api/posts',cors(),commentsRoute);

module.exports = app;