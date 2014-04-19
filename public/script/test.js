$(document).ready(function() {
	$('#posttabs a').click(function (e) {
	  e.preventDefault();
	  $(this).tab('show');
	});
});