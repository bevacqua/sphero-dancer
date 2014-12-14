'use strict';

var Cylon = require('cylon');

Cylon.robot({
  connections: {
    sphero: { adaptor: 'sphero', port: '/dev/tty.Sphero-PGO-AMP-SPP' }
  },

  devices: {
    sphero: { driver: 'sphero' }
  },

  work: function (w) {
    var s = w.sphero;
    var collision = false;
    var timers = {};

    s.detectCollisions();
    s.configureLocator(0, 0, 0, 0);
    s.setColor(0xFFFF00);

    forward();
    treatyoself();
    dancejs();

    s.on('collision', function () {
      collision = true;
      console.log('ZOMG I COLLIDED!');
      s.setColor(0xDC143C);
      s.roll(80, 190);
      if (timers.fwd) {
        forward(); // reset forward so you don't get stuck!
      }
    });

    s.on('locator', function () {
      console.log(arguments);
    });

    function stop (timer) {
      if (timers[timer]) {
        clearInterval(timers[timer]);
        delete timers[timer];
      }
    }

    function treatyoself () {
      stop('tyo');
      timers.tyo = setInterval(function treatment () {
        if (collision) {
          collision = false; return;
        }
        console.log('TREAT YO~SELF!');
        s.setColor(0x7FFF00);
        s.roll(30, 60);
        forward(); // give it time...!
      }, 3500);
    }

    function dancejs () {
      stop('djs');
      timers.djs = setInterval(function tunes () {
        var i = 1;
        var max = 24;
        stop('djs');
        stop('fwd');
        stop('tyo');
        console.log('DANCE TO THE TUNES!');
        for (; i < max; i++) {
          setTimeout(recolor(), i * 100);
          setTimeout(recolor(), i * 200);
          setTimeout(recolor(), i * 300);
          setTimeout(recolor(), i * 400);
          setTimeout(recolor(), i * 500);
          setTimeout(roll(i), i * 500);
        }
        function roll (i) {
          return function () {
            var speed = 40 + 70 * Math.random();
            var back = i % 2 !== 0 ? 180 : 0;
            var head = (20 - 40) * Math.random() + back;
            if (head < 0) {
              head += 360;
            }
            s.roll(Math.floor(speed), Math.floor(head));
            if (i === max - 1) {
              forward();
              treatyoself();
              dancejs();
            }
          };
        }
        function recolor () {
          return function () {
            s.setRandomColor();
          }
        }
      }, 18000);
    }

    function forward () {
      stop('fwd');
      timers.fwd = setInterval(function movement () {
        console.log('FORWARD 60!');
        s.setColor(0xFFFF00);
        s.roll(60, 0);
      }, 1300);
    }
  }
}).start();
