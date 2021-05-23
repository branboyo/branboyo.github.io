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
