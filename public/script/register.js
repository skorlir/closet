$(document).ready(function() {
	
	$('#registerForm').submit(function(event) {
		event.preventDefault();
		event.stopPropagation();
		
		$.ajax({
				url: "/register",
				method: "POST",
				data: $('#registerForm').serialize()
			}).done(function(data) {
				console.log(data);
			});
	});
});