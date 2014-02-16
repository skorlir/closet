
function loadDirect(data) {
	if(data)	$('.stories').append(data);
}

$(document).ready(function() {
	
	$.ajax({
		url: '/items/masters',
		method: 'GET' })
	.done(function(data) {
		console.log(data);
		loadDirect(data);
	});
});