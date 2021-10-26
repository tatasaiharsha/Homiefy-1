const  firebaseObj = require('./firebase');
const {doc, setDoc,getDoc} =  require("firebase/firestore");
const {uploadBytes,ref,getDownloadURL } =  require("firebase/storage");
const express = require('express');
const config = require('./config')
const fileUpload = require('express-fileupload');
const cors  = require('cors')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const bcrypt = require('bcryptjs')


const app = express();
const oneDay = 1000 * 60 * 60 * 24;

/// setting sessions config
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload()); 
app.use(express.static(__dirname + '/public'))
app.use(cors())
app.use(cookieParser());

//set views
app.set('views', './views')
app.set('view engine', 'ejs')


app.all('/', cors(), async (req,res)=>{

    if(req.method === 'GET'){
        console.log("server here...")
        res.render('index',{msg:""})
    }
    
});



app.all('/register',cors(), async(req,res)=>{

    if(req.method === 'POST'){
        const data = req.body;
        const file = req.files
       
        const user = await getDoc(doc(firebaseObj.db, 'Users', data.email));
        
        if (user.exists()) {
            
           
            res.render('index', {msg:"Email already in use"});
        }
        else {
            /* ref returns a refence the newly created folder
                then uploadbytes upload the profile picture to that folder
                getDownloadURL get the url of the image which is stored in the Users collection
            */
            const storageRef = ref(firebaseObj.storage, `profilepicture/${data.email}/${file.profilePicture.name }`); 
            const uploadedFile = await uploadBytes(storageRef, file.profilePicture.data);
            const fullPath = uploadedFile.metadata.fullPath;
            const img = await getDownloadURL(ref(firebaseObj.storage, fullPath));
            data.profilePicture = img;
            data.password= await bcrypt.hash(data.password,10);  /// hashed password
            await setDoc(doc(firebaseObj.db, "Users", data.email), data); ///creating new user in firebase with email as the ID
        
            
            req.session.userName = data.email;
            res.render('profile',{msg:img})
                       
        } 
    }
    else{
        res.redirect('/');
    
    }
    
});

app.all('/login', cors(), async(req,res)=>{

    if(req.method === 'POST'){
        const data = req.body;
        const user = await getDoc(doc(firebaseObj.db, 'Users', data.email)); // fetching record from firebase
        
       
        if (user.exists()) {
            
            const validPassword = await bcrypt.compare(data.password,user._document.data.value.mapValue.fields.password.stringValue)
            if(validPassword){
               
               
                req.session.userName = data.email;
              
                res.redirect('profile')
            }
            else{
               
                res.render('index',{msg:"wrong password"});
            }
    
        }
        else {
            
            res.render('index',{msg:`No account associated with ${data.email} email`});
            
        } 
    }
    else{
        res.redirect('/');
    }
});



app.get('/logout', cors(),(req,res)=>{

    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});

app.all('/profile', cors(), async (req,res)=>{

    if(req.method === 'GET'){

        
        if(req.session.userName){
            const user = await getDoc(doc(firebaseObj.db, 'Users', req.session.userName));
            const img = user._document.data.value.mapValue.fields.profilePicture.stringValue;
        //    const {twitter} = user._document.data.value.mapValue.fields.socialMediaLinks.mapValue.fields;
            
        //    console.log(twitter)
            res.render('profile',{msg:img});
        }
        else{
            res.redirect('/')
        }
    }

});

app.listen(config.port, () =>{
    console.log(`listening on port ${config.port}`)
})