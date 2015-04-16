// Generated by CoffeeScript 1.9.1
(function() {
  var Buttons, Router, r,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.minute = 60000;

  this.bmp = 40;

  this.audio = document.querySelector("audio");

  Buttons = (function(superClass) {
    extend(Buttons, superClass);

    function Buttons() {
      this.decrement = bind(this.decrement, this);
      this.increment = bind(this.increment, this);
      this.numofBeats = bind(this.numofBeats, this);
      this.playLogic = bind(this.playLogic, this);
      this.stop = bind(this.stop, this);
      this.play = bind(this.play, this);
      return Buttons.__super__.constructor.apply(this, arguments);
    }

    Buttons.prototype.el = ".container";

    Buttons.prototype.template = _.template($("#mainView").html());

    Buttons.prototype.events = {
      "click .add": "play",
      "click .stop": "stop",
      "click .beat": "numofBeats",
      "click .increment": "increment",
      "click .decrement": "decrement"
    };

    Buttons.prototype.initialize = function() {
      this.render();
      this.add = document.querySelector(".add");
      this.beatNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      this.beat = document.querySelector(".beat");
      this.counter = 1;
      this.cox = 1;
      this.beatAudio = document.createElement("audio");
      return this.beatAudio.src = "files/beat.wav";
    };

    Buttons.prototype.play = function(e) {
      if (this.counter === 1) {
        $(".increment").click();
      }
      if (e.target) {
        this.playLogic();
        return e.target.setAttribute("disabled", "disabled");
      }
    };

    Buttons.prototype.stop = function() {
      var id;
      audio.pause();
      audio.currentTime = 0;
      id = window.setTimeout((function() {}), 0);
      while (id--) {
        window.clearTimeout(id);
      }
      this.$el.find(".add").removeAttr("disabled");
      return this.cox = 1;
    };

    Buttons.prototype.playLogic = function() {
      setTimeout(((function(_this) {
        return function() {
          _this.playLogic();
          _this.cox++;
          if (_this.cox === _this.counter) {
            _this.beatAudio.play();
            return _this.cox = 0;
          }
        };
      })(this)), minute / this.$el.find(".txt1").val());
      audio.load();
      return audio.play();
    };

    Buttons.prototype.numofBeats = function() {};

    Buttons.prototype.increment = function() {
      this.counter++;
      if (this.counter === 17) {
        this.counter = 1;
      }
      return this.beat.innerHTML = "Beat: " + this.beatNum[this.counter];
    };

    Buttons.prototype.decrement = function() {
      this.counter--;
      if (this.counter === 0) {
        this.counter = 16;
      }
      return this.beat.innerHTML = "Beat: " + this.beatNum[this.counter];
    };

    Buttons.prototype.render = function() {
      return this.$el.html(this.template());
    };

    return Buttons;

  })(Backbone.View);

  Router = (function(superClass) {
    extend(Router, superClass);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.routes = {
      "": "default",
      "hidden": "tig"
    };

    Router.prototype["default"] = function() {
      var v;
      return v = new Buttons();
    };

    Router.prototype.tig = function() {
      return console.log("hi there");
    };

    return Router;

  })(Backbone.Router);

  r = new Router();

  Backbone.history.start();

}).call(this);