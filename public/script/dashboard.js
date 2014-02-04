$(document).ready(function() {
	
	$('.userForm').submit(function(e) {
		e.preventDefault();
		e.stopPropagation();
	
		$.ajax({
			url: "",
			method: "POST",
			data: $(this).serialize()
		}).done(function(data){
			console.log(data);
		});
	}
												
});