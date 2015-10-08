window.gui = require('nw.gui');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var os = require('os');
var ifaces = os.networkInterfaces();
 
//$(function() {
	
	//Launcher for AJAX Loaded Items
	function runcommand(cmd){
		$('#loadingmodal').modal('show');
		var app = "gksudo '/usr/share/fmservermanager/scripts/" + cmd + "'";
		//app = '"' + app + '"';
		console.log(app);
		exec(app);
	}
	
	function createroles() {
		//Assign JSON File
		var file = fs.readFileSync('/usr/share/fmservermanager/db/packages.json', "utf8");
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
		var file = fs.readFileSync('/usr/share/fmservermanager/db/packages.json', "utf8");
		var obj = jQuery.parseJSON(file);
		//For each object in json
		$.each(obj, function(key,value) {
			//Console log what role is being updated
			console.log(value.title);
			//Set lock directory and file
			var lockdir = "/usr/share/fmservermanager/db/";
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
			
			//Extras
			var extraparent = "#extramenu";
			var extralisting = "extra" + value.uuid;
			var extratitle = value.extra;
			console.log(extratitle);
			var extramenu = '<li role="presentation" id="' + extralisting + '"><a href="' + value.uuid +'.html">' + extratitle + '</a></li>';
			//End Extras
			
			
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
						//Add Extra
						if (value.extra) { $(extraparent).append(extramenu); }
						//Close Loading Modal
						$(loadingmodal).modal('hide');
					} 
					//If Installed and button disabled
					else {
						// If menu item exist
						if ($(menulisting).length) {
							$(parentmenu).append(menuitem);
							//Add Extra
							if (value.extra) { $(extraparent).append(extramenu); }
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
	
	function populatefields(){
		fs.readFile("/usr/share/fmservermanager/db/unifiuser", "UTF8", function(err, data) {
			if (err) { throw err };
			document.getElementById('unifiuser').value = data;
		});
	}
	
	function populatebackups(){
		var backupdir = "/usr/share/fmservermanager/backups/unifi";
		fs.readdir(backupdir, function(err, files) {
			if (err) return;
			files.forEach(function(filename) {
				$('#unifibackups').append('<li>' + filename + '</li>');
			});
		});

	}
	
	$('#saveunifibackup').click(function(){
		var unifiuser = document.getElementById('unifiuser').value;
		var unifipass = document.getElementById('unifipass').value;
		$(loadingmodal).modal('show');
		var cmd = "gksudo '/usr/share/fmservermanager/scripts/updateunifibackups " + unifiuser + " " + unifipass + "'";
		//fs.writeFile("/usr/share/fmservermanager/db/unifiuser", unifiuser, function(err) {
		//if(err) { throw err }
		//	fs.writeFile("/usr/share/fmservermanager/db/unifipass", unifipass, function(err) {
		//	if(err) { throw err }
		//	$(loadingmodal).modal('hide');
		//	});
		//});
		exec(cmd);
		$(loadingmodal).modal('hide');
	});
	
	//Legacy Launcher for hard coded items
	$('.applauncher').click(function(){
		var app = $(this).attr('data-value');
		exec(app);
	});

	//Initial Run Through
	$(document).ready(function(){
		updateroles();
		populatefields();
		populatebackups();
	});
	
	//Update Every 5 Seconds
	window.setInterval(function(){ 
		//Nothing 
	}, 5000);
	
//});