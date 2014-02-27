function getProfileImg(e,o) { $.get(o+'/photo').done(function(img){ e.src = img; }) }

$('document').ready(function(){
	$.each($('img[data-prof]'), function(idx,el) {
      getProfileImg(el,$(el).data('prof'));
	});
});