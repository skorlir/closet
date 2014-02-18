$(document).ready(function() {
	$('#loginForm').submit(function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		$('button').attr('disabled', true);
		$('button')
		
		$.ajax({
				url: "/login",
				method: 'POST',
				data: $(this).serialize()
			}).done(function(data) {
				console.log(data);
				window.location.href = data;
			});
	});
});