document.querySelector("#show-login1").addEventListener("click",function(){
   
    const loginform = document.querySelector(".loginForm")
    const register = document.querySelector(".registerForm")
    
    if(loginform.hidden){
        loginform.hidden=false;
        register.hidden = true;
        return;
    }
    loginform.classList.add("active");

    
});
document.querySelector("#show-register").addEventListener("click",function(){
    
      const loginform = document.querySelector(".loginForm")
      const register = document.querySelector(".registerForm")

        loginform.hidden = true
        if(!register.hidden){
            register.classList.add("active")
            
        }
        else{
            
            register.classList.add("active")
            register.hidden=false;
        }
    
});


document.querySelector("#show-login2").addEventListener("click",function(){
    
    const registerform = document.querySelector(".registerForm")
    const loginform = document.querySelector(".loginForm")
    registerform.hidden= true;

    if(!loginform.hidden){

        document.querySelector(".loginForm").classList.add("active")
            
    }
    else{
        loginform.hidden=false;
    }
    
});
document.querySelector(".loginForm .close-btn").addEventListener("click",function(){
    document.querySelector(".loginForm").classList.remove("active");
});


document.querySelector(".registerForm .close-btn").addEventListener("click",function(){
    document.querySelector(".registerForm").classList.remove("active");
});