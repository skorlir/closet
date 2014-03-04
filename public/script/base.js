function getProfileImg(e,o) { $.get(o+'/photo').done(function(img){ e.src = img; }) }
function insertName(e,n) { $.get(n+'/name').done(function(name){ e.textContent = name.first+' '+name.last; }) }

$('document').ready(function(){
	$.each($('img[data-prof]'), function(idx,el) {
      getProfileImg(el,$(el).data('prof'));
	});
	
	$.each($('h4[data-get]'), function(idx, el) {
		insertName(el, $(el).data('get'));
	});
});