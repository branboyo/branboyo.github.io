//When unhovering projects, allow for "View details" to disappear by changing opacity
let items = document.getElementsByClassName("item");
    [].forEach.call(items, function(item){
        item.addEventListener("mouseout", function(){  
            var p1 = document.getElementById("p1");
            p1.style="opacity:0"
            var p2 = document.getElementById("p2");
            p2.style="opactiy:0"
            var p3 = document.getElementById("p3");
            p3.style="opactiy:0"
            var p4 = document.getElementById("p4");
            p4.style="opactiy:0"
            var p5 = document.getElementById("p5");
            p5.style="opactiy:0"
        })
    })
//When hovering above projects, allow for "View details" to appear by changing opacity
let item1 = document.getElementById("item1");
item1.addEventListener("mouseover", function(){
    let p1 = document.getElementById("p1");
    p1.style="opacity:100";        
})

let item2 = document.getElementById("item2");
item2.addEventListener("mouseover", function(){
    let p2 = document.getElementById("p2");
    p2.style="opacity:100";        
})

let item3 = document.getElementById("item3");
item3.addEventListener("mouseover", function(){
    let p3 = document.getElementById("p3");
    p3.style="opacity:100";        
})

let item4 = document.getElementById("item4");
item4.addEventListener("mouseover", function(){
    let p4 = document.getElementById("p4");
    p4.style="opacity:100";        
})

let item5 = document.getElementById("item5");
item5.addEventListener("mouseover", function(){
    let p5 = document.getElementById("p5");
    p5.style="opacity:100";        
})

//Intermediate function that catches the project's corresponding popup to display.
function popup(i){
    if (i==1){
        var popup = document.getElementById("popup-1");
    } else if (i==2){
        var popup = document.getElementById("popup-2");
    } else if (i==3){
        var popup = document.getElementById("popup-3");
    } else if (i==4){
        var popup = document.getElementById("popup-4");
    } else {
        var popup = document.getElementById("popup-5");
    }
    curtain(popup)
    popup.style.display = "block";
    
}

function curtain(popup){
    //Reveals the dark background of the popup
    var curtain = document.getElementById("curtain");
    curtain.style.display = "block";

    //Closes itself and the popup when it is clicked on
    curtain.onclick = function(event) { 
        if (event.target == curtain) {
            let vids = document.querySelectorAll("video");
            [].forEach.call(vids, function(vid){
                vid.pause();
            })
            curtain.style.display = "none"; 
            popup.style.display = "none";
        }
    }
}

//Function used by "X" button in popup to close all popups and the curtain
function hideall(){
    var popups = document.getElementsByClassName("popup");
    var curtain = document.getElementById("curtain");
    curtain.style.display = "none";
    [].forEach.call(popups, function(popup){
        popup.style.display= "none";
    })
}



