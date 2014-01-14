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
			$.ajax({
				url: "/users",
				method: 'POST'
			}).done(function( data ) {
				console.log( "response: ", data );
			});
		}
		
		//else quietly die :-D
   });
	
	var winwh, winhh;
	
	winwh = Math.floor($(window).width()/20);
	winhh = Math.floor($(window).height()/8);
	$.easing.smoothishmove = function (x, t, b, c, d) {	
		return -c *(t/=d)*(t-2) + b;
 	}; 
	
	function parallalax(e) { 
		body.animate({
   'background-position-x': -winwh + 0.08*e.pageX-winwh,
   'background-position-y': -winhh + 0.08*e.pageY-winhh
 }, {queue:false,duration:100,easing:'smoothishmove'});
		console.log((winwh - e.pageX)/winwh + ' ' + (winhh - e.pageY)/winhh);
		}
	
	$(document).mousemove(function (e) {
		//parallalax(e);
	});
});