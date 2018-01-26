var particlesConfig = {
  "particles": {
    "number": {
      "value": 50,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.3,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 250,
      "color": "#ffffff",
      "opacity": 0.3,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 3,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": false,
        "mode": "grab"
      },
      "onclick": {
        "enable": false,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
}


function scroll_to(clicked_link, nav_height) {
	var element_class = clicked_link.attr('href').replace('#', '.');
	var scroll_to = 0;
	if(element_class != '.top-content') {
		element_class += '-container';
		scroll_to = $(element_class).offset().top - nav_height;
	}
	if($(window).scrollTop() != scroll_to) {
		$('html, body').stop().animate({scrollTop: scroll_to}, 1000);
	}
}


jQuery(document).ready(function() {

	/*
	    Navigation
	*/
	$('a.scroll-link').on('click', function(e) {
		e.preventDefault();
		scroll_to($(this), $('nav').outerHeight());
	});
	// toggle "navbar-no-bg" class
	$('.top-content .text').waypoint({
		handler: function() {
			$('nav').toggleClass('navbar-no-bg');
		},
		offset: "50px"
	});

	/*$('.top-content .icon').waypoint(function() {
		$('nav .navbar-brand').toggleClass('navbar-no-icon');
		$('.top-content .icon').toggleClass('top-content-no-icon');
	});*/

	$('.navbar-toggle').click(function() {
		if($('nav').hasClass('navbar-no-bg')) {
			$('nav').toggleClass('navbar-show-bg');
		}
	});

    /*
        Wow
    */
    new WOW().init();

		// particles.js
    if($('#particles-container').length) {
      window.particlesJS('particles-container', particlesConfig);
    }

    // process in services
    $('.process-bar-step').each(function(idx, processStep) {
      $(processStep).on('click', (function(idx) {
        return function() {
          // adjust bar
          $('.process-bar-step').removeClass('active');
          $('.process-bar-step').eq(idx).addClass('active');
          $('.process-bar .active-bar').width((idx * 20) + '%');

          // adjust content
          $('.process-steps .process-step').removeClass('active');
          $('.process-steps .process-step').eq(idx).addClass('active animated fadeInUp');
        };
      })(idx));
    });

});

var s = Snap("#svg-animation");

var circles = [];

var firstLayer = 5;
var wSpace = 200;
var hSpace = 150;
var x = 100;
var y = 150;

function createCircles(x,y,n,wSpace,hSpace) {
  if(n-1 >= 0) {
    createCircles(x+wSpace, y+hSpace/2, n-1, wSpace, hSpace);
  }
  for(var i=1; i<= n; i++) {
    circles.push(s.circle(x, y, 30).attr({fill: "#fff", stroke: "#ddd", strokeWidth: 1}));
    y += hSpace;
  }
}

createCircles(x,y,5,wSpace, hSpace);

/*
var c1 = s.circle(100, 200, 30).attr({fill: "#fff", stroke: "#ddd", strokeWidth: 1});
var c2 = s.circle(100, 400, 30).attr({fill: "#fff"});
var c3 = s.circle(100, 600, 30).attr({fill: "#fff"});

var c4 = s.circle(500, 200, 30).attr({fill: "#fff"});
var c5 = s.circle(500, 400, 30).attr({fill: "#fff"});
*/
var p14 = s.path({path:'M100 100 L300 200',fill: "none", stroke: '#fff', strokeWidth: 7});
var p15 = s.path({path:'M100 100 L300 400',fill: "none", stroke: '#fff'});
var p24 = s.path({path:'M100 300 L300 200',fill: "none", stroke: '#fff'});
var p25 = s.path({path:'M100 300 L300 400',fill: "none", stroke: '#fff'});
var p34 = s.path({path:'M100 500 L300 200',fill: "none", stroke: '#fff'});
var p35 = s.path({path:'M100 500 L300 400',fill: "none", stroke: '#fff'});

var cc1 = s.circle(100, 100, 10).attr({fill: "#fff"});

cc1.animate({ transform: 't200 100' }, 15000);



