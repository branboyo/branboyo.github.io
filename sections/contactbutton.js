//Form button transition, since we need to wait for the child template to load in order to retrieve.
document.getElementById('send').addEventListener("mouseover", function(){
    let button = document.getElementById('send');
    button.style = "background-color:#847577; color:#fff";
});

document.getElementById('send').addEventListener("mouseout", function(){
    let button = document.getElementById('send');
    button.style = "background-color:#fff; color:black";
});