'use strict';

const NodeHelper = require('node_helper');
const spawn = require('child_process').spawn;

module.exports = NodeHelper.create({
	start: function() {
		console.log('MMM-updateFromStdOut helper started ...');
	},
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'REQUEST-MMM-updateFromStdOut') {
			var self = this;

	                var rtl_433 = spawn('/usr/local/bin/rtl_433', ['-q', '-G', '-s', '1000000'], {
        	                detached: true
                	});
	                rtl_433.stdout.on('data', function (data) {
        	                try {
                	                var strData = data.toString();
	
        	                        var temp = "-1000";
                	                var humidity = "-1000";
                        	        var battery = "exploding";
	
        	                        temp = strData.split("temperature ")[1].split(" C / ")[0];
                	                humidity = strData.split("humidity ")[1].split("%")[0];
                        	        battery = strData.split("battery ")[1].split(", ")[0];
	
        	                        self.sendSocketNotification('DATA-MMM-updateFromStdOut', {
                	                        temp: temp,
                        	                humidity: humidity,
                                	        battery: battery
	                                });
        	                } catch(err) {
                	                console.log(err);
                        	}
	                });
		}
	}
});
