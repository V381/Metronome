/**
 * Created by JS on 8/2/14.
 */
(function(){ // Encapsulate code
    var minute = 60000, // Get Variables
        bmp = 40,
        button = document.querySelector(".add"),
        input1 = document.querySelector(".txt1"),
        button2 = document.querySelector(".stop");

    var audio = document.querySelector("audio");


    button.addEventListener("click", function(e){


        if (e.target){ // If button start is clicked, disable it, and call sarko() method/function
            sarko();
            e.target.setAttribute("disabled", "disabled");
        }


    },false);


    button2.addEventListener("click", function(){
        audio.pause();
        audio.currentTime = 0;
        var id = window.setTimeout(function() {}, 0); // If button stop is clicked, then stop metronome, clear all timeout from global window object
        while (id--) {
            window.clearTimeout(id);
        }
        button.removeAttribute("disabled");

    }, false);

    function sarko(){
        console.log(setTimeout(function(){
            sarko();
        }, minute/input1.value)); // By dividing minute and value we get correct parameters for metronome
        audio.load();
        audio.play();
    }

    function stop(){
        clearTimeout(sarko());
        audio.pause();
        audio.currentTime = 0;
    }
})();
