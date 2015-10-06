// FikesMedia Server Manager
// Network Configuration GUI
// FikesMedia Support <Support@FikesMedia.com>

//Node Requirements . . . I Know Overkill
window.gui = require('nw.gui');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var os = require('os');


//Function to loop interfaces and build GUI for address management.
function buildnetworkform(){
	
	//For Each Interface
	$.each(os.networkInterfaces(), function(key,ethint) {
		//Check for lo and skip
		if(ethint[0]="lo") {
			//Do Nothing
		} else {
			//Continue Processing JSON of Interfaces
			//Draw Header
			var intheader='<h4 class="ethintheader">' + ethint[0] + '</h4>';
			$("#networkinterfaceform").append(intheader);
			//For Each Address on Interface
			$.each(ethint, function(key,attr) {
				//Build Form
				var intform='<div class="form-group">' +
							'<label for="' + ethint + attr.family + 'family" class="col-sm-2 control-label">' + 'Address Family' + '</label>' +
							'<div class="col-sm-10">' +
							'<input type="text" class="form-control" id="' + ethint + attr.family + 'family" value="' + attr.family + ' readonly">' +
							'</div>' + 
							'</div>' +
							'<!-- ITEM -->' +
							'<div class="form-group">' +
							'<label for="' + ethint + attr.family + 'mac" class="col-sm-2 control-label">' + 'Address' + '</label>' + 
							'<input type="text" class="form-control" id="' + ethint + attr.family + 'mac" value="' + attr.mac + '" readonly>' +
							'</div>' +
							'</div>' +
							'<!-- ITEM -->' +
							'<div class="form-group">' +
							'<label for="' + ethint + attr.family + 'address" class="col-sm-2 control-label">' + 'Address' + '</label>' + 
							'<input type="text" class="form-control" id="' + ethint + attr.family + 'address" value="' + attr.address + '">' +
							'</div>' +
							'</div>' +
							'<!-- ITEM -->' +
							'<div class="form-group">' +
							'<label for="' + ethint + attr.family + 'netmask" class="col-sm-2 control-label">' + 'Netmask' + '</label>' + 
							'<input type="text" class="form-control" id="' + ethint + attr.family + 'netmask" value="' + attr.netmask + '">' +
							'</div>' +
							'</div>' +
							'<!-- ITEM -->';
				//Draw Form for Interface Address
				$("#networkinterfaceform").append(intform);
			}); //End Address Form
			//Add Fields for Default Gateways
			var gwform=	'<div class="form-group">' + 
						'<label for="ipv4gw" class="col-sm-2 control-label">IPv4 Gateway</label>' +
						'<div class="col-sm-10">' +
						'<input type="text" class="form-control" id="ipv4gw" placeholder="000.000.000.000">' +
						'</div>' + 
						'</div>' +
						'<!-- ITEM -->' +
						'<div class="form-group">' + 
						'<label for="ipv6gw" class="col-sm-2 control-label">IPv6 Gateway</label>' +
						'<div class="col-sm-10">' +
						'<input type="text" class="form-control" id="ipv4gw" placeholder="000.000.000.000">' +
						'</div>' + 
						'</div>' +
						'<!-- ITEM -->';
			//Draw Gateway Form
			$("#networkinterfaceform").append(gwform);
		}		
	});

}