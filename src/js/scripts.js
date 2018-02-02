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

/*
const s = Snap("#svg-animation");

const layers = [4,3,4,3,4,3]
const x = 50;
const y = 120;
const wSpace = 190;
const hSpace = 110;
let circles = [];
let circleCoords = [];
let paths = [];

// Iterate layers
for(let layer = 0; layer < layers.length; layer++) {
  let nrNodes = layers[layer];
  circles[layer] = [];
  circleCoords[layer] = [];
  // Iterate nodes in current layer
  for(let node = 0; node < nrNodes; node++) {
    let curX = x + layer*wSpace;
    let curY = y + (Math.max.apply(Math, layers)-nrNodes)*hSpace/2 + node*hSpace;
    circleCoords[layer].push({x: curX, y: curY});
    // Add a circle for each node
    circles[layer].push(s.circle(curX, curY, 10).attr({
      fill: "#fff",
      fillOpacity: 0.2,
      stroke: "#ddd",
      strokeOpacity: 0.3,
      strokeWidth: 1
    }));
    // Is this not the last layer?
    if (layer < layers.length) {
      // Add paths to all subsequent nodes
      for (let j = 0; j < layers[layer + 1]; j++) {
//        debugger;
        paths.push(s.path({
          path: 'M' + curX + ' ' + curY + 'L' + (curX + wSpace) + ' ' + (y + (Math.max.apply(Math, layers)-layers[layer+1])*hSpace/2 + j*hSpace),
          fill: "none",
          stroke: '#fff',
          strokeOpacity: 0.2,
          strokeWidth: 1
        }));
      }
    }
  }
}

let spawned = [];
let promises = [];

for (let i = 0; i < layers.length; i++) {
  promises[i] = [];
}

function spawnForm(layer, node) {

  let targetNodes = circleCoords[layer + 1] ? circleCoords[layer + 1].length : 0;

  for (let target in circleCoords[layer + 1]) {
    const el = s.circle(circleCoords[layer][node].x, circleCoords[layer][node].y, 3).attr({
      fill: "#fff",
      fillOpacity: 0.5,
      stroke: "#ddd",
      strokeOpacity: 0.3,
      strokeWidth: 1
    });

    const diffX = circleCoords[layer + 1][target].x - circleCoords[layer][node].x;
    const diffY = circleCoords[layer + 1][target].y - circleCoords[layer][node].y;
    const time = Math.floor((Math.random() * 20000) + 15000);
    const promise = new Promise((resolve, reject) => {
      el.animate({transform: 't' + diffX + ' ' + diffY}, time, () => {
        resolve(el);
      });
    });

    promises[target].push(promise);
  }

  spawned[layer] = spawned[layer]+1;
  if(spawned[layer] === layers[layer]) {
    spawned[layer] = 0;
    for(let targetNode = 0; targetNode < targetNodes; targetNode++) {
      Promise.all(promises[targetNode])
        .then(res => {
          for(let el in res) {
            res[el].remove();
          }
          if (layer < layers.length) {
            spawnForm(layer + 1, targetNode);
            circles[layer+1][targetNode].animate({r: 25}, 1000, () => {
              circles[layer+1][targetNode].animate({r: 20}, 1000);
            });
            console.log("Spawned: "+(layer+1)+ " "+targetNode);
          }
          promises[targetNode] = [];
        }, err => {

        });
    }
  }

}

for(let i=0; i < layers.length; i++){
  spawned[i] = 0;
}

for(let i=0; i < layers[0]; i++) {
  spawnForm(0,i);
}
for(let i=0; i < layers[3]; i++) {
  spawnForm(3,i);
}

setInterval(() => {
  for(let i=0; i < layers[0]; i++) {
    spawnForm(0,i);
  }
}, 30000);

*/


