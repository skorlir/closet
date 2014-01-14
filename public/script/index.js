$(document).ready(function () {

  var body = $('body');
	var overlay = $('.banner');
	var validemail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	
	$('button').click(function () {
		//validate email and send to database
		if( validemail.test( $(this).prev().val() ) ) { 
			//send off the valid email to be handled all ajax-y like
			console.log("That's what I call a good email!");
			//TODO: make an $.ajax(); ter teh serverr
		}
		
		//else quietly die :-D
   });
	
	var winwh, winhh;
	
	winwh = Math.floor($(window).width()/8);
	winhh = Math.floor($(window).height()/6);
	$.easing.smoothishmove = function (x, t, b, c, d) {	
		return -c *(t/=d)*(t-2) + b;
 	}; 
	
	function parallalax(e) { 
		body.animate({
   'background-position-x': -winwh + (e.pageX-winwh)/10,
   'background-position-y': -winhh + (e.pageY-winhh)/10
 }, {queue:false,duration:100,easing:'smoothishmove'});
		console.log((winwh - e.pageX)/winwh + ' ' + (winhh - e.pageY)/winhh);
		}
	
	$(document).mousemove(function (e) {
		parallalax(e);
	});
});