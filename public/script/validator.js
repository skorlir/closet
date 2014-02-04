var months = ["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov","Dec"];
//var full_months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

function monthName(m){
	return months[m];
}

function validate(formelement){
	if(formelement.value){
		switch(formelement.name) {
			case 'firstName':
			case 'lastName':
				if(formelement.value.length < 2) {
					invalid(formelement, "Surely your name is longer than that.");
				}
				break;
			case 'username':
				if(formelement.value.length < 3) invalid(formelement, "Usernames must be longer than 2 characters.");
				if(formelement.value.search(/[\/\\.@!~`\[\]";:'&|]/) > -1) invalid(formelement, "Usernames may not contain any of /\\.@!~`[]\";:'&|");
				break;
			case 'email':
				if(!formelement.value.search(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)==0) {
					invalid(formelement, "Please use a valid email address.");
				}
				break;
			case 'date':
				var today  = new Date();
				var yr = today.getFullYear();
				var curm = today.getMonth()+1;
				var curd = today.getDate();
				var m,d,y;
				if(typeof formelement == 'date') {
					//browser should handle validation, but make sure within bounds
					var inputDate = formelement.value;
					d = inputDate.substr(8,10);
					m = inputDate.substr(5,7);
					y = inputDate.substr(0,4);
				} else {
					var val = formelement.value;
					if(!val.search(/(0?[1-9]|1[012])[\\- \/.](0?[1-9]|[12][0-9]|3[01])[\\- \/.](?:19|20)\\d{2}'/)==0) {
						invalid(formelement, "That date isn't quite right... Try mm/dd/yyyy.");
					} else {
						//now the date should be formatted correctly
						//modify the numbers so's you can choose whether to put 0s before single digit months/days
						var moff = 0;
						var doff = 0;
						var delimiter = new RegExp('[\\- /.]');
						if(val.substr(1,2).search(delimiter)==0) {
							moff = 1;
						}
						if(val.substr(4-moff,5-moff).search(delimiter)==0) {
							doff = 1;
						}
						//get day, month, year
						var m = Number(val.substr(0,2-moff));
						var d = Number(val.substr(3-moff,2-doff));
						var y = Number(val.substr(6-moff-doff));

						//check to ensure valid month and day. Checks leap year.
						if(d>31||d<1) {
							invalid(formelement, "There aren't ANY months with that number of days.");
						}
						var msg = "Invalid day. Here, http://www.youtube.com/watch?v=drH3_Flt85g might help.";	
						var daysleft = 31 - curd;
						if(jQuery.inArray(m, [ 4,6,9,11 ])>-1) {
							if(d>30) {
								invalid(formelement, msg);
							}
						}
						if(m==2){
							if((y%4==0 && d>29) || d>28) {
								invalid(formelement, msg);
							}
						}

						if(jQuery.inArray(curm, new Array(4,6,9,11))>-1) {
							daysleft++;
						}
						if(curm == 2) {
							daysleft+=2;
						}		
					}
				}
				//at this point, daysleft tells how many days remain in the month, m is the month, d the day, and y the year.
				break;
			default:
				console.log("There is not validation for " + formelement.name);
				break;
		} 
	} else {	if(jQuery(formelement).attr('required')) { invalid(formelement, "Required field.");	}}
}

function invalid(el, msg) {
	console.log(msg);
	if(!jQuery(el).parent().hasClass('invalid')) {
		jQuery(el).wrap('<span class="fontawesome-flag validation-msg invalid"></span>');
		var warning = document.createElement('p');
		(jQuery(warning).addClass("input-warning-msg")).text(msg).insertBefore(jQuery(el));
	}
}

function warn(el, msg) {
	console.log(msg);
	if(!jQuery(el).parent().hasClass('warn') && !jQuery(el).parent().hasClass('invalid')){
		jQuery(el).wrap('<span class="fontawesome-flag validation-msg warn"></span>');
		var warning = document.createElement('p');
		(jQuery(warning).addClass("input-warning-msg")).text(msg).insertBefore(jQuery(el));
	}
}

function resetWarnings(jel){
	if(jel.parent().hasClass('invalid') || jel.parent().hasClass('warn')) {
		jel.prev().remove();
		jel.unwrap();
		}
}
