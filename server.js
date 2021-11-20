const firebaseObj = require('./firebase');
const { doc, setDoc, getDoc,collection } = require("firebase/firestore");
const { uploadBytes, ref, getDownloadURL } = require("firebase/storage");
const express = require('express');
const config = require('./config')
const fileUpload = require('express-fileupload');
const cors = require('cors')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const multer = require("multer");
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
const oneDay = 1000 * 60 * 60 * 24;

/// setting sessions config
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));
app.use(multer({dest:'./uploads/'}).single('profilePicture'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());
app.use(express.static(__dirname + '/public'))
app.use(cors())
app.use(cookieParser());
app.use(bodyParser.json());

//set views
app.set('views', './views')
app.set('view engine', 'ejs')




app.get('/', cors(), async (req, res) => {

    console.log("server here...")
    res.render('index', { msg: "" })


});



app.get('/register', cors(), async (req, res) => res.redirect('/'));
app.post('/register', cors(), async (req, res) => {

    
    
    let data = req.body;
    const file = req.file
    

   
    const user = await firebaseObj.db.collection('Users').doc(data.email).get()
    
    
    if (user.exists) { return res.render('index', { msg: "Email already in use" })}
    try {
        
            const storageRef = await firebaseObj.storage.upload(file.path, {
            destination: `profilepicture/${data.email}/${file.originalname}`,
            resumable: false,
            metadata: {
             metadata: {
              contentType: file.mimetype
             }
            }
           }).then((response) => {
            let file = response[0]
            file.getSignedUrl({
              action: 'read',
              expires: '03-17-2025'
            }, async function(err, url) {
              if (err) {
                console.error(err);
                return;
              }
    
              let college= new Object();
                college['major']= 'computer science';   // a string key
                college["name"]= 'UH';     // a numeric key
                college["year"] ='freshman'; // a boolean key
                college["url"] ='tsu.edu'; // a boolean key
                data.password = await bcrypt.hash(data.password, 10);  /// hashed password
                data = {
                    ...data,
                    college,
                    "profilePicture":url
                }
                  
                await firebaseObj.db.collection('Users').doc(`${data.email}`).set(data)
               
                req.session.userName = data.email;
                res.redirect('/profile')
            })})
            


    }
    catch (err) {
        console.log(err)
        res.render('index', { msg: `something went wrong while creating account for ${data.email}` });

    }



    
});


app.get('/login', cors(), async(req,res) => res.redirect('/'));
app.post('/login', cors(), async (req, res) => {

   

        const data = req.body;
        try {
            const user = await firebaseObj.db.collection('Users').doc(data.email).get()

            if (user.exists) {

                try {

                    const validPassword = await bcrypt.compare(data.password, user._fieldsProto.password.stringValue)
                    if (validPassword) {


                        req.session.userName = data.email;

                        res.redirect('/profile')
                    }
                }
                catch (err) {

                    console.log(err)
                    res.render('index', { msg: "wrong password" });
                }

            }
        }

        catch (err) {
            console.log(err)
            res.render('index', { msg: `No account associated with ${data.email} email` });

        }
    
   
});



app.get('/logout', cors(), (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});


app.get('/profile/edit', cors(), async(req,res) => {
    
    
    if (req.session.userName) {
        const user = await firebaseObj.db.collection('Users').doc(req.session.userName).get()

        
        const img = "profilePicture" in user._fieldsProto ? user._fieldsProto.profilePicture.stringValue : "";
        const fname = user._fieldsProto.fname.stringValue;
        const lname = user._fieldsProto.lname.stringValue;
        const email = user._fieldsProto.email.stringValue;
        const college= user._fieldsProto.hasOwnProperty("college")? user._fieldsProto.college.mapValue.fields: "" ;
        const social = user._fieldsProto.hasOwnProperty("socialMediaLinks")?user._fieldsProto.socialMediaLinks.mapValue.fields:"";
        
       
      
        res.render('profile-edit', {img,fname, lname,email,social,college});
    }
    else {
        res.redirect('/')
    }
   
    
});

app.get('/profile', cors(), async (req, res) => {

    if (req.session.userName) {
        const user = await firebaseObj.db.collection('Users').doc(req.session.userName).get()
        
        
        if (user.exists) {
            const img = "profilePicture" in user._fieldsProto ? user._fieldsProto.profilePicture.stringValue : "";
            const fname = user._fieldsProto.fname.stringValue;
            const lname = user._fieldsProto.lname.stringValue;
            const email = user._fieldsProto.email.stringValue;
            const college= user._fieldsProto.hasOwnProperty("college")? user._fieldsProto.college.mapValue.fields: "" ;
            const social = user._fieldsProto.hasOwnProperty("socialMediaLinks")?user._fieldsProto.socialMediaLinks.mapValue.fields:"";
            res.render('profile', { img,fname, lname,email,social,college});
        }
    }
    else{
    
         res.redirect('/');
     
    }
    

});


app.listen(config.port, () => {
    console.log(`listening on port ${config.port}`)
})
