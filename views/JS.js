document.querySelector("#show-login").addEventListener("click",function(){
    if(document.querySelector(".registerForm").classList.contains("active")){
        document.querySelector(".registerForm").classList.remove("active");
    }
    if(document.querySelector(".loginForm").classList.contains("active")){
        document.querySelector(".loginForm").classList.remove("active");
    }
    document.querySelector(".loginForm").classList.add("active");
});

document.querySelector(".loginForm .close-btn").addEventListener("click",function(){
    document.querySelector(".loginForm").classList.remove("active");
});

document.querySelector("#show-register").addEventListener("click",function(){
    if(document.querySelector(".registerForm").classList.contains("active")){
        document.querySelector(".registerForm").classList.remove("active");
    }
    if(document.querySelector(".loginForm").classList.contains("active")){
        document.querySelector(".loginForm").classList.remove("active");
    }
    document.querySelector(".registerForm").classList.add("active");
});

document.querySelector(".registerForm .close-btn").addEventListener("click",function(){
    document.querySelector(".registerForm").classList.remove("active");
});