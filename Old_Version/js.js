/**
 * Created by JS on 8/2/14.
 */
var minute = 60000,
    bmp = 40,
    button = document.querySelector(".add"),
    input1 = document.querySelector(".txt1"),
    button2 = document.querySelector(".stop");

var audio = document.querySelector("audio");


button.addEventListener("click", function(e){
    if (e.target){
        sarko();
        this.setAttribute("disabled", "disabled");
    }
},false);

button2.addEventListener("keydown", function(e){
    if (e.target){
        sarko();
    }
},false);






button2.addEventListener("click", function(){
    clearTimeout(sarko());

}, false);

function sarko(){
    console.log(setTimeout(function(){
        sarko();
    }, minute/input1.value));
    audio.load();
    audio.play();
}

