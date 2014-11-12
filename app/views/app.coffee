# Global variables

@minute = 60000
@bmp = 40
@audio = document.querySelector("audio");

# Create View class

class Buttons extends Backbone.View
  el : ".buttons"
  template : _.template($("#mainView").html())

  events :
    "click .add" : "play"
    "click .stop" : "stop"

  play : (e) =>
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

  playLogic : () =>
    setTimeout ( =>
      @playLogic()
    ), minute/@.$el.find(".txt1").val()
    audio.load()
    audio.play()

  render : () ->
    @.$el.html(@template())


class Router extends Backbone.Router
  routes :
    "" : "default"
    "hidden" : "tig"

  default : () ->
    v = new Buttons()
    v.render()

  tig : () ->
    console.log "hi there"

r = new Router()
Backbone.history.start()