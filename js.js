/**
 * Created by JS on 8/2/14.
 */
(function(){
    var minute = 60000,
        bmp = 40,
        button = document.querySelector(".add"),
        input1 = document.querySelector(".txt1"),
        button2 = document.querySelector(".stop");

    var audio = document.querySelector("audio");


    button.addEventListener("click", function(e){


        if (e.target){
            sarko();
            e.target.setAttribute("disabled", "disabled");
        }


    },false);


    button2.addEventListener("click", function(){
        audio.pause();
        audio.currentTime = 0;
        var id = window.setTimeout(function() {}, 0);
        while (id--) {
            window.clearTimeout(id);
        }
        button.removeAttribute("disabled");

    }, false);

    function sarko(){
        console.log(setTimeout(function(){
            sarko();
        }, minute/input1.value));
        audio.load();
        audio.play();
    }

    function stop(){
        clearTimeout(sarko());
        audio.pause();
        audio.currentTime = 0;
    }
})();
