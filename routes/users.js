const router = require('express').Router()
const User = require('../db/models/User')
const bcrypt = require('bcryptjs');
const Post = require('../db/models/Post')

router.get('/profile/:id', async(req,res)=>{


    // if (!req.session.currentUser){ return res.send('redirect to log in')};
    if (!req.session.currentUser){ 
        if(process.env.NODE_ENV === 'test') return res.status(404).send({"error":"login first"});
        return res.redirect('/')};
    // if (!req.params.id){ return res.send('redirect to log in')};

    if(req.session.currentUser._id == req.params.id){

        try{
            // const user = await User.findOne({_id:req.session.currentUser._id});
            const user = await User.findOne({_id:req.session.currentUser._id});  //for test modo change params to currentuser
            const post = await Post.find({whoPosted:req.session.currentUser._id});  //for test modo change params to currentuser
    
            if(user) {
                
                if(process.env.NODE_ENV === 'test'){

                    if(user._id == req.params.id) return res.status(200).send(user);
                }
                res.render('profile.ejs', {user:req.session.currentUser,currentuser:req.session.currentUser, posts:post})
                
            }
            else {
                
                if(process.env.NODE_ENV === 'test') return res.status(404).send({"error":'Account no longer exist'})
                res.redirect(404,'/',msg={"error":'Account no longer exist'})}
           
        }catch(err){
    
            res.status(500).send(err)

        }
        
    }
    else{

        try{
            const user = await User.findOne({_id:req.params.id});  //for test modo change params to currentuser
            const post = await Post.find({whoPosted:req.params.id});  //for test modo change params to currentuser
    
            if(user) {
                
                
                if(process.env.NODE_ENV === 'test') return res.status(200).send(user);
                res.render('profile.ejs', {user,currentuser:req.session.currentUser, posts:post})
                
            }
            else{ 

                if(process.env.NODE_ENV === 'test') return res.status(404).send({"error":'Account no longer exist'})
                res.redirect(404,'/',msg={"error":'Account no longer exist'})
            }
           
        }catch(err){
    
            res.status(500).send(err);
        }
        
    }
    
   
  
    
});


router.get('/profile-edit/:id', async (req,res) => {

    if(!req.session.currentUser){
        if(process.env.NODE_ENV === 'test') return res.status().send({"error":"login first"})
        res.redirect(401,'/',msg={"error":"login first"} )
    }

    try{


        const currentuser = req.session.currentUser;
        const user = await User.findOne({_id:currentuser._id});  //for test modo change params to currentuser
        const post = await Post.find({whoPosted:currentuser._id});  //for test modo change params to currentuser
    
        if(process.env.NODE_ENV === 'test') return res.status(200).send(user);
        res.render('profile-edit.ejs',{user,currentuser, posts:post})

    }catch(err){
        res.status(500).send(err);

    }
})
//update user

router.post('/profile-edit/:id', async(req,res)=>{
    

    if(!req.session.currentUser){
        
        if(process.env.NODE_ENV === 'test') return res.status(403).send({"error":"Login first"});
        return res.redirect('/', msg={"error":"Login first"});
    
    }
    if(req.params.id != req.session.currentUser._id){ 
        
        if(process.env.NODE_ENV === 'test') return res.status(403).send({"error":"Need to login"})

        res.redirect(401,`/profile-edit/${req.session.currentUser._id}`)
    
    };
    
    if(Object.keys(req.body).length === 0){ 
        
        if(process.env.NODE_ENV === 'test') return res.status(409).send({"error":"no empty fields"})
        return res.redirect(409,`/profile-edit/${req.session.currentUser}`,msg={"error":"no empty fields"})}

    if(req.body.passwordd){
        
        try{
            req.body.password = await bcrypt.hash(req.body.password, 10);  
            
        }
        catch(err){
            console.log(err);
        }
        
    }
    try{

        const user = await User.findByIdAndUpdate(req.params.id,{$set:req.body},{useFindAndModify: false,new: true});
        if(process.env.NODE_ENV === 'test') return res.status(200).send(user);
        res.redirect(200,`/profile-edit/${req.session.currentUser._id}`, msg={"success":"Profile updated"});

    }catch(err){

        console.log(err);
        res.status(500).send(err);
    }


});
//delete user

router.delete('/profile/:id', async(req,res)=>{
    
    if(!req.session.currentUser){

        if(process.env.NODE_ENV === 'test') return res.status(401).send({"error":"Login first"})
        return res.redirect('/', msg={"error":"Login first"});
    }

    try{

        const user = await User.deleteOne({_id:req.session.currentUser});


        if(process.env.NODE_ENV === 'test') return res.status(200).send({"msg":'user deleted'});

        res.redirect(200,'logout',msg={"sucess":"account deleted"})
        
    }catch(err){
        
        console.log(err);
        res.status(500).send(err);
    }
    

});

module.exports = router;