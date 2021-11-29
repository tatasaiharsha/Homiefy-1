const router = require('express').Router()
const User = require('../db/models/User')
const bcrypt = require('bcryptjs');


//register route
router.post('/register', async (req,res)=>{

    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email
    });

    if(!newUser.email || !newUser.lastName || !newUser.password || !newUser.firstName) {res.status(409).send({"error":"missing fields"}); return;}
    
    const user = await User.findOne({email:newUser.email})
    
    if(user){ res.status(409).send({"error":"Email taken"}); return;};

    try{
        
        req.session['currentUser'] = newUser;
        newUser.password = await bcrypt.hash(newUser.password, 10);  
        newUser.save();
        res.status(201).send(newUser);
        // res.redirect(`../users/profile/${newUser._id}`);
        
    }catch(err){

       res.status(500).send(err)

    }
    
    


});


router.post('/login', async(req,res,next)=>{
    // 
    // if(req.session.currentUser){ return res.redirect(`../users/profile/${req.session.currentUser._id}`)}
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password) {res.status(409).send({"error":"missing fields"}); return;}


    const user = await User.findOne({email:email});
  
    if(!user){
        res.status(404).send({"error":'account no found'});
        return;
        // return res.render('index', { msg: `No account associated with ${email} email` });
    
    }
    
  
    try{
        const validPassword = await bcrypt.compare(password, user.password)
        

            if(validPassword) {
                
                req.session['currentUser'] = user; 
                
                // req.session.save()
                // res.status(200).send({"msg":"logged in"});
                // res.status(200).send(req.session);
                res.redirect(`../users/profile/${user._id}`);
            }
        else{
            res.status(400).send({"error":'wrong password'});
            return;
        }

    }catch(err){

        console.log(err);
        res.status(404).send(err);

    }

    

});



router.get('/logout', (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});



module.exports = router;