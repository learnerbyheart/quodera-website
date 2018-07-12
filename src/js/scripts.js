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

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function activateTypeformPoll() {
	$('.cookies-not-activated').hide();
	$('.typeform-widget').show();
	(function() {
		var qs, js, q, s, d = document,
			gi = d.getElementById,
			ce = d.createElement,
			gt = d.getElementsByTagName,
			id = "typef_orm",
			b = "https://embed.typeform.com/";
		if (!gi.call(d, id)) {
			js = ce.call(d, "script");
			js.id = id;
			js.src = b + "embed.js";
			q = gt.call(d, "script")[0];
			q.parentNode.insertBefore(js, q)
		}
	})();
}

function activateGoogleAnalytics() {
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-115912116-1', { 'anonymize_ip': true });
  var gascript = document.createElement("script");
  gascript.async = true;
  gascript.src = "https://www.googletagmanager.com/gtag/js?id=UA-115912116-1";
  document.getElementsByTagName("head")[0].appendChild(gascript, document.getElementsByTagName("head")[0]);
}

function optOutOfGoogleAnalytics(gaSettings) {
	document.cookie = 'ga-disable-UA-115912116-1=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
  window['ga-disable-UA-115912116-1'] = true;
  deleteCookie('_ga');
  deleteCookie('_gid');
  deleteCookie('_gat_gtag_UA_115912116_1');
}

function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function setTracking(useTracking) {
  // save answer with Cookie
  setCookie('useTracking', (!!useTracking).toString(), 5*365);
  // activate Google Analytics
  if(useTracking) {
    activateGoogleAnalytics();
  } else {
    optOutOfGoogleAnalytics();
  }
}

function checkTracking() {
  // user has rejected tracking
  if(navigator.doNotTrack == 1 || getCookie('useTracking') === 'false') {
    //do nothing
  } else if(getCookie('useTracking') === 'true') {
    // user has accepted tracking
    activateGoogleAnalytics();
		activateTypeformPoll();
  } else {
    // user has not anwered tracking question
    // ==> show dialog
    $('#cookie-popup').show();
  }
}

function initAutoVideoPlay(identifier) {
	if($(identifier)) {
		$(identifier).waypoint({
			handler: function() {
				$(identifier).get(0).play();
			},
			offset: 'bottom-in-view'
		})
	}
}

jQuery(document).ready(function() {


  // cookie settings
  checkTracking();
  // if user is on the privacy page, configure set cookie button
  if($('#privacy-set-cookie')) {
    if(getCookie('useTracking') === 'true') {
      $('#privacy-reject-cookie').show();
    } else {
      $('#privacy-accept-cookie').show();
    }
  }
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
			$('nav').toggleClass('navigation-no-bg navigation-inverse');
		},
		offset: "50px"
	});

	$('.navbar-toggle').click(function() {
		if($('nav').hasClass('navbar-no-bg')) {
			$('nav').toggleClass('navbar-show-bg');
		}
	});

	initAutoVideoPlay('#voty_application_poll');
	initAutoVideoPlay('#voty_poll_results');

    /*
        Wow
    */
    new WOW().init();

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
