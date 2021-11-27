// const express = require('express');
// // const mongoose = require('mongoose');;
const config = require('./config')
// const fileUpload = require('express-fileupload');
// const cors = require('cors')
// const cookieParser = require("cookie-parser");
// const session = require('express-session');
// const multer = require("multer");
// const bcrypt = require('bcryptjs');
// const bodyParser = require('body-parser');
// const usersRoute = require('./routes/users');
// const authRoute = require('./routes/auth');
// const MongoStore = require('connect-mongo')(session);
// const dbURL = "mongodb+srv://admin:admin@homiefy.jputf.mongodb.net/Homiefydb?retryWrites=true&w=majority"

// // mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true})
// // .then((result) =>{console.log("connected to database")})
// // .catch((err)=> console.log(err))
// const usersRoute = require('./routes/users');
// const authRoute = require('./routes/auth');
// const app = express();
const db = require('./db/index')
const app = require('./app')




// function sessionHandler(req, res, next) { 
    //     const sess = req.session.currentUser;
//     next();

// }
// // app.use(multer({dest:'./uploads/'}).single('profilePicture'));
// // app.use(express.urlencoded({ extended: false }));
// // app.use(express.json());
// // app.use(fileUpload());
// app.use(express.static(__dirname + '/public'))
// app.use(cors())
// app.use(cookieParser());
// app.use(bodyParser.json());

// //set views
// app.set('views', './views')
// app.set('view engine', 'ejs')



// //routes
// app.use('/api/auth',cors(),authRoute);
// app.use('/api/users',cors(),usersRoute);

// app.use('/api/auth',authRoute);
// app.use('/api/users',usersRoute);

// app.get('/', cors(), async (req, res) => {
    
    //     console.log("server here...")
    //     res.render('index', { msg: "" })
    
    
    // });
    
db.connect()
.then((result) => { 
           
        app.listen(config.port, () => {
        console.log(`listening on port ${config.port}`)
    })
    
    
    
})
