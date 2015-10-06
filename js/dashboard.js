window.gui = require('nw.gui');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var os = require('os');
var ifaces = os.networkInterfaces();
var cpus = os.cpus();
 
//$(function() {
	
	//Launcher for AJAX Loaded Items
	function runcommand(cmd){
		$('#loadingmodal').modal('show');
		var app = "gksudo 'xfce4-terminal -e /home/cfikes/Desktop/servermanager/scripts/" + cmd + "'";
		//app = '"' + app + '"';
		console.log(app);
		exec(app);
	}
	
	function createroles() {
		//Assign JSON File
		var file = fs.readFileSync('js/packages.json', "utf8");
		var obj = jQuery.parseJSON(file);
		//Clear out static
		$('#availableroles').html("");
		//For each object in json
		$.each(obj, function(key,value) {
			//Build Executions
			var ibtncode = "runcommand('" + value.icmd + "')";
			var pbtncode = "runcommand('" + value.pcmd + "')";
			//Build Code
			var thisrole =	'<div class="col-md-4">' +
							'<div class="serverrole">' +
							'<img src="img/' + value.img + '">' +
							'<h4>' + value.title + '</h4>' +
							'<p>' + value.desc + '</p>' +
							'<button type="button" id="install' + value.uuid + 'btn" class="btn btn-success" onclick="' + ibtncode + '">Install Role</button>' +
							'&nbsp;&nbsp;' +
							'<button type="button" id="purge' + value.uuid + 'btn" class="btn btn-danger" onclick="' + pbtncode + '">Purge Role</button>' +
							'</div>' +
							'</div>\n';
			//Place in HTML
			$('#availableroles').append(thisrole);
			//Console log what just happen
			console.log("Built and added " + value.uuid);
		});
	}
	
	function updateroles() {
		//Assign JSON File
		var file = fs.readFileSync('js/packages.json', "utf8");
		var obj = jQuery.parseJSON(file);
		//For each object in json
		$.each(obj, function(key,value) {
			//Console log what role is being updated
			console.log(value.title);
			//Set lock directory and file
			var lockdir = "/home/cfikes/Desktop/servermanager/db/";
			var lockfile = lockdir + value.uuid;
			//Set simplier variables
			var title = value.title;
			var desc = value.desc;
			var img = value.img;
			var installbtn = "#install" + value.uuid + "btn";
			var purgebtn = "#purge" + value.uuid + "btn";
			var menulisting = "my" + value.uuid;
			var parentmenu = "#mainmenu";
			var loadingmodal = "#loadingmodal";
			var menuitem = '<li role="presentation" id="' + menulisting + '"><a class="applauncher" onclick=\'exec("' + value.launch + '");\'>' + title + '</a></li>';
			//Check for lock file
			fs.readFile(lockfile, function (err, data) {
				//If no lock exist
				if (err) {
					//If install button disabled
					if($(installbtn).attr('disabled')){
						//Enable install button
						$(installbtn).removeAttr('disabled', 'disabled');
						//Disable purge button
						$(purgebtn).attr('disabled', 'disabled');
						//Remove Menu Item
						$("#" + menulisting).remove();
						//Close Loading Modal
						$(loadingmodal).modal('hide');
					} 
					//If no lock cleanup
					else {
						//If purge button enabled
						if(!$(purgebtn).attr('disabled')) {
							//Disable purge button
							$(purgebtn).attr('disabled', 'disabled');	
							//Remove Menu Item
							$("#" + menulisting).remove();							
						}
					}
				}
				//If lock exist	
				if (data) {
					//If installed and button is enabled
					if(!$(installbtn).attr('disabled')){
						//Enable Purge Button
						$(purgebtn).removeAttr('disabled', 'disabled');
						//Disable Install Button
						$(installbtn).attr('disabled', 'disabled');
						//Add Menu Item
						$(parentmenu).append(menuitem);
						//Close Loading Modal
						$(loadingmodal).modal('hide');
					} 
					//If Installed and button disabled
					else {
						// If menu item exist
						if ($(menulisting).length) {
							$(parentmenu).append(menuitem);
						} 
						//If menu item does not exist
						else {
							//Create Menu Item
							
						}
					}
				}
			});
		});
	}
	function populateinfotable(){
		console.log(os.networkInterfaces());
		//For Each In OS.NetworkInterfaces Loop and Grab IP
		//Each Int
		$.each(os.networkInterfaces(), function(key,interfaces) {
			//Each In INT
			$.each(interfaces, function(key,intobj) {
				console.log(intobj.address);
				$("#ipaddress").append('<div style="margin:1px">' + intobj.address + '</div>');
			});
				
		});
				
		function formatSecondsAsTime(secs, format) {
			var hr  = Math.floor(secs / 3600);
			var min = Math.floor((secs - (hr * 3600))/60);
			var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

			if (hr < 10)   { hr    = "0" + hr; }
			if (min < 10) { min = "0" + min; }
			if (sec < 10)  { sec  = "0" + sec; }
			if (hr)            { hr   = "00"; }

			if (format != null) {
				var formatted_time = format.replace('hh', hr);
				formatted_time = formatted_time.replace('h', hr*1+""); // check for single hour formatting
				formatted_time = formatted_time.replace('mm', min);
				formatted_time = formatted_time.replace('m', min*1+""); // check for single minute formatting
				formatted_time = formatted_time.replace('ss', sec);
				formatted_time = formatted_time.replace('s', sec*1+""); // check for single second formatting
				return formatted_time;
			} else {
				return hr + ':' + min + ':' + sec;
			}
		}
		
		var systemuptime = formatSecondsAsTime(os.uptime());
		
		console.log(systemuptime);
		$("#systemhostname").append(os.hostname());
		$("#systemuptime").append(systemuptime);
	}
	
	//Get CPU Usage
	function getcpuusage(){
		var usage = os.loadavg();
		console.log(Math.round(usage[0]));
		return Math.round(usage[0]);
	}	
	//CPU Guage Updater
	document.addEventListener("DOMContentLoaded", function(event) {
        var cpugauge = new JustGage({
            id: "cpugauge",
			title: "CPU Usage",
            value: 100,
            min: 0,
            max: 100,
            donut: true,
            gaugeWidthScale: 1,
            counter: true
        });
		
		window.setInterval(function(){ 
		cpugauge.refresh(getcpuusage()); 
		}, 1000);
    });
	//End CPU

	//Get Memory Usage
	function getmemoryusage(){
		var totalmem = os.totalmem();
		var freemem = os.freemem();
		var percentage = Math.round((freemem/totalmem)*100);
		console.log(percentage);
		return percentage;
	}
	//Memory Guage Updater
	document.addEventListener("DOMContentLoaded", function(event) {
        var memgauge = new JustGage({
            id: "memgauge",
			title: "Memory Usage",
            value: 100,
            min: 0,
            max: 100,
            donut: true,
            gaugeWidthScale: 1,
            counter: true
        });
		
		window.setInterval(function(){ 
		memgauge.refresh(getmemoryusage()); 
		}, 1000);
    });
	//End CPU

	
	
	//Legacy Launcher for hard coded items
	$('.applauncher').click(function(){
		var app = $(this).attr('data-value');
		exec(app);
	});

	//Initial Run Through
	$(document).ready(function(){
		updateroles();
		populateinfotable();
	});
	
	//Update Every 5 Seconds
	window.setInterval(function(){ 
		//Nothing 
	}, 5000);
	
//});