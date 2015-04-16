# Global variables

@minute = 60000
@bmp = 40
@audio = document.querySelector("audio");

# Create View class

class Buttons extends Backbone.View
  el : ".container"
  template : _.template($("#mainView").html())

  events :
    "click .add" : "play"
    "click .stop" : "stop"
    "click .beat" : "numofBeats"
    "click .increment" : "increment"
    "click .decrement" : "decrement"

  initialize : () ->
    @render()
    @add = document.querySelector(".add");
    @beatNum = [0..16]
    @beat = document.querySelector(".beat");
    @counter = 1;
    @cox = 1;
    @beatAudio = document.createElement("audio")
    @beatAudio.src = "files/beat.wav";

  play : (e) =>
    if @counter is 1 then $(".increment").click();
    if e.target
      @playLogic()
      e.target.setAttribute "disabled", "disabled"

## If stop button is clicked, clear the setTimeout from running
  stop : () =>
    audio.pause()
    audio.currentTime = 0
    id = window.setTimeout (->
    ), 0
    window.clearTimeout id  while id--
    @.$el.find(".add").removeAttr("disabled")
    @cox = 1;

  playLogic : () =>
    setTimeout ( =>
      @playLogic()
      @cox++;
      if @cox is @counter
        @beatAudio.play()
        @cox = 0;

    ), minute/@.$el.find(".txt1").val()
    audio.load()
    audio.play()

  numofBeats : () =>

  increment : () =>
    @counter++;
    if @counter is 17 then @counter = 1;
    @beat.innerHTML = "Beat: #{@beatNum[@counter]}"

  decrement : () =>
    @counter--;
    if @counter is 0 then @counter = 16;
    @beat.innerHTML = "Beat: #{@beatNum[@counter]}"


  render : () ->
    @.$el.html(@template())


class Router extends Backbone.Router
  routes :
    "" : "default"
    "hidden" : "tig"

  default : () ->
    v = new Buttons()

  tig : () ->
    console.log "hi there"

r = new Router()
Backbone.history.start()