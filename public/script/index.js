$(document).ready(function () {

  var body = $('body');
	var overlay = $('.banner');
	
	$('button').click(function () {
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
 }, {queue:false,duration:50,easing:'smoothishmove'});
		console.log((winwh - e.pageX)/winwh + ' ' + (winhh - e.pageY)/winhh);
		}
	
	$(document).mousemove(function (e) {
		parallalax(e);
	});
});