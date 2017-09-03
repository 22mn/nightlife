$(document).ready(function(){

	$(".going").click(function(){
		
		var span = $(this).children('span');
		var idVal = $(this).attr("id");
		$.ajax({
			url: "/user/going",
			type: "POST",
			dataType: "json",
			data: {"id": idVal},
			success:function(data){			
				span.text(data.count);					
			}
		});
	});

	$('#info').popover({title: "<span id='siteInfo'>A <a href='https://www.freecodecamp.com/mgjean' target='_blank'>MGJEAN </a>Site.</span>",
        content: "<span id='siteWish'>Good day amigos!</span>",html:true,placement:"left"});
	
});




