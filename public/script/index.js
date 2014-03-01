$(document).ready(function () {

  var body = $('body');
	var overlay = $('.banner');
	var email = $('input[type=text]');
	var password = $('input[type=password]');
	var msgParagraph = $('#add-msg');
	var validemail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	
	$('button').click(function () {
		//validate email and send to database
		if( /*validemail.test( email.val() )*/ true ) { 
			//send off the valid email to be handled all ajax-y like
			console.log("That's what I call a good email!");
			$(this).css('opacity', '0');
			msgParagraph.show();
			setTimeout( function () {
				$(this).hide();
			}, 300);
			
			$.ajax({
				url: "/login",
				method: 'POST',
				data: 'username='+email.val()+'&password='+password.val()
			}).fail(function(xhr, textStatus, err){
				console.log(xhr.status);
				if(xhr.status===401) {
					msgParagraph.text('Whoops, you\'re not in the database!');
					msgParagraph.append('<a href="/register?username='+email.val()+'">Click here to register.</a>');
				}
			}).done(function(data) {
				console.log(data);
				window.location = data;
			});

//			$.ajax({
//				url: "/users/subscribers",
//				method: 'POST',
//				data: {'email': input.val()}
//			}).done(function( data ) {
//				if (!data.error) {
//					console.log(data);
//					$('#add-msg').text(data.txt);
//				} else {
//					$(this).parent().val('Sorry, it looks like we ran into some trouble. Try again later?');
//				}
//			});
		} else {
			console.log('NOT A VALID EMAIL YOU TURRIBLE PERSAN');
		}
		
   });
	
});