jQuery(document).ready(function($) {
	$('#wait').fadeOut();
	$('#results').dataTable();
	$('#submitform').click(function(){
		
		var feedurl = $('#feedurl').val();
		var newsnumber = $('#newsnumber').val();
		var admantx_calls = 0;
		var dataSend = '';
		
		$.ajax({
			url: 'getfeedlinks.php',
			data: 'feedurl='+encodeURIComponent(feedurl),
			dataType: "json",
			beforeSend: function(){
				$('#wait:hidden').fadeIn('fast');
			},
			success: function(data){
				admants_call = 0;
				$.each(data, function (title, newsdata) {
					//$("#results").append('<tr><td>' + title + '</td><td>' + link + '</td></tr>');
					if(admantx_calls<newsnumber){
						dataSend = '{"key":"d2ff021b1139abfb724010b29c02b0236e9bee474e34b9266597ae105e89683d","method":"descriptor","type":"URL","mode":"sync","body": "'+newsdata.link+'"}';
						console.log(dataSend);
						$.ajax({
							url: 'http://admantx-cluster-nlb-304649940.us-east-1.elb.amazonaws.com/admantx/service',
							data: 'request='+dataSend,
							dataType: 'json',
							crossDomain: true,
							beforeSend: function(){
								admantx_calls += 1;
								$('#wait:hidden').fadeIn('fast');
							},
							success: function(admantx){
								console.log(admantx);
								var admants_data = '';
								$.each(admantx.admants, function(n,admant){
									admants_data += '<span class="' + admant.score + '">' + admant.name + ': ' + admant.score + "</span><br/>";
								});
								var newslink = '<a target="_blank" href="' + newsdata.link + '">' + title +  '</a>';
								$('#results').dataTable().fnAddData([newslink,newsdata.data,admants_data]);
							},
							error: function(admants){
								console.log(admants);
								alert("Errore di ADmantX");
							},
							complete: function(){
								admantx_calls -= 1;
								if(admantx_calls==0)
									$('#wait:visible').fadeOut('fast');
							}
						});
					}
				});
			},
			error: function(data){
				alert ("FEED RSS non valido!");
			},
			complete: function(){
				if(admantx_calls==0)
					$('#wait:visible').fadeOut('fast');
			}
		});
		return false;
	});
});