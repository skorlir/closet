$(document).ready(function () {

  var body = $('body');
	var overlay = $('.banner');
	var input = $('input[type=email]');
	var validemail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	
	$('button').click(function () {
		//validate email and send to database
		if( validemail.test( $(this).prev().val() ) ) { 
			//send off the valid email to be handled all ajax-y like
			console.log("That's what I call a good email!");
			$(this).css('opacity', '0');
			$('<p id="add-msg" style="margin: 0">Adding you to the database...</p>').insertBefore(this);
			setTimeout( function () {
				$(this).hide();
			}, 300);

			$.ajax({
				url: "/users/subscribers",
				method: 'POST',
				data: {'email': input.val()}
			}).done(function( data ) {
				if (!data.isError) {
					console.log(data);
					$('#add-msg').text(data.txt);
				} else {
					$(this).parent().val('Sorry, it looks like we ran into some trouble. Try again later?');
				}
			});
		} else {
			console.log('NOT A VALID EMAIL YOU TURRIBLE PERSAN');
		}
		
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