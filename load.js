//CSS Transitions upon loading
document.body.onload=function(){
    let name = document.querySelector('h1');
    name.style = "transition:1.5s ease-out; transform: translateY(3vw); opacity:100";

    let caption = document.querySelector('h2');
    caption.style = "transition:1.5s ease-out; transform: translateY(-1.5vw); opacity:100";

    let ribbon = document.querySelector('.links-ribbon');
    ribbon.style = "transition: 1.75s; transform: translateX(0);"
};


//Reactive tab items on mouse hover (CAN BE REFACTORED WITH CLASSSELECTOR AND ARRAY ITERATOR)
//When tab item is hovered

document.getElementById('tprj').addEventListener("mouseover", function(){
    let prj = document.getElementById('tprj');
    prj.style.color="#847577";
});
//When tab item is not hovered
document.getElementById('tprj').addEventListener("mouseout", function(){
    let prj = document.getElementById('tprj');
    prj.style.color='#fff';
})

document.getElementById('tskill').addEventListener("mouseover", function(){
    let prj = document.getElementById('tskill');
    prj.style.color="#847577";
});

document.getElementById('tskill').addEventListener("mouseout", function(){
    let skill = document.getElementById('tskill');
    skill.style.color="#fff";
})

document.getElementById('tctc').addEventListener("mouseover", function() {
    let prj = document.getElementById('tctc');
    prj.style.color="#847577";
});

document.getElementById('tctc').addEventListener("mouseout", function() {
    let prj = document.getElementById('tctc');
    prj.style.color="#fff";
});

//Loads child HTML onto parent(page.html)
$(function(){
    $("#prj").load("sections/projects.html"); 
})

$(function(){
    $("#skill").load("sections/skills.html"); 
})

$(function(){
    $("#ctc").load("sections/contact.html"); 
})




