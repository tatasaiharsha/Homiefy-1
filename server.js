const  db = require('./firebase');
const {collection, addDoc,doc, setDoc,getDoc } =  require("firebase/firestore");
const express = require('express');
const config = require('./config')
// const path = require("path");
// const router = express.Router();
const app = express();
const cors  = require('cors')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const port = 8001
// const bodyParser = require("body-parser");

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use(cookieParser());

//set views
app.set('views', './views')
app.set('view engine', 'ejs')


app.all('/', cors(), async (req,res)=>{

    if(req.method === 'GET'){
        console.log("server here...")
        res.render('index')
       
    }else{
        const data = req.body 
       
        addNewUser(req,res,data)
        
        // if (!c){
        //     await setDoc(doc(db, "Users", email), data);
        // }else{
        //     res.send("email is taken")
        // }
        
        
        //const docRef = await addDoc(collection(db, "Users"),data);
        
        //console.log("Document written with ID: ", docRef.id);
    
      
    }

});


app.all('/profile', cors(),(req,res)=>{

    if(req.method === 'GET'){

        
        if(req.session.userName){
           
            console.log(req.session)
            res.render('profile',{user:req.session.userName});
        }
        else{
            res.redirect('/')
        }
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
async function addNewUser(req,res,data){



    const user = await getDoc(doc(db, 'Users', data.email))

    if (user.exists()) {
      req.session.userName = data.email
        res.send("email is taken")

        
      
    }
    else {
       
        await setDoc(doc(db, "Users", data.email), data);
       
    } 
    
}

app.listen(config.port, () =>{
    console.log(`listening on port ${config.port}`)
})