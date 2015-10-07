window.gui = require('nw.gui');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var os = require('os');
var ifaces = os.networkInterfaces();

$(function() {
	$('#currenthostname').html(os.hostname());
	
	$('.applauncher').click(function(){
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
		  $('#ifacename').html(ifname);
		  $('#ifaceaddress').html(iface.address);
		}
		});
	});
				
	var date = new Date();
	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;
	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;
	var day  = date.getDate();
	day = (day < 10 ? "0" : "") + day;
	var currentsystemtime = month + "/" + day + "/" + year + " " + hour + ":" + min;

	$('#currentsystemtime').html(currentsystemtime);
});