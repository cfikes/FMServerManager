window.gui = require('nw.gui');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var os = require('os');
var ifaces = os.networkInterfaces();

$(function() {
	
	function updateroles(){
		//Begin Check UniFi
		fs.readFile('/home/cfikes/Desktop/servermanager/db/unifi', function (err, data) {
		  if (err) 
			if($('#installunifibtn').attr('disabled')){
				$('#installunifibtn').removeAttr('disabled', 'disabled');
				$('#purgeunifibtn').attr('disabled', 'disabled');
				//Remove Menu Item
				$('#myunificontroller').remove();
				$('#loadingmodal').modal('hide');
			} else { 
				if(!$('#purgeunifibtn').attr('disabled')) {
					$('#purgeunifibtn').attr('disabled', 'disabled');			
				}
			}
		  if (data)
			if(!$('#installunifibtn').attr('disabled')){
				$('#purgeunifibtn').removeAttr('disabled', 'disabled');
				$('#installunifibtn').attr('disabled', 'disabled');
				//Add Menu Item
				$("#mainmenu").append('<li role="presentation" id="myunificontroller"><a class="applauncher" onclick=\'exec("firefox https://localhost:8443");\'>UniFi Controller</a></li>');
				$('#loadingmodal').modal('hide');
			} else {
				if ($('#myunificontroller').length) {
					//Do Nothing
				} else {
					$("#mainmenu").append('<li role="presentation" id="myunificontroller"><a class="applauncher" onclick=\'exec("firefox https://localhost:8443");\'>UniFi Controller</a></li>');
				}
			}
		});
		//End UniFi Check
	}

	$('.installrolebtns').click(function(){
    	var app = $(this).attr('data-value');
		console.log(app);
		exec(app);
	});
  
	$('.networkconfigbtn').click(function(){
		var app = $(this).attr('data-value');
		exec(app);
	});
	
	$('.applauncher').click(function(){
		$('#loadingmodal').modal('show');
		console.log("OpenModal");
		var app = $(this).attr('data-value');
		exec(app);
	});

	Object.keys(ifaces).forEach(function (ifname) {
	var alias = 0;

	ifaces[ifname].forEach(function (iface) {
	if ('IPv4' !== iface.family || iface.internal !== false) {
	  // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
	  return;
	}

	if (alias >= 1) {
		  // this single interface has multiple ipv4 addresses
		  console.log(ifname + ':' + alias, iface.address);
		} else {
		  // this interface has only one ipv4 adress
		  console.log(ifname, iface.address);
		}
		});
	});

	$(document).ready(function(){ updateroles(); });
	window.setInterval(function(){ updateroles(); }, 5000);
	
});