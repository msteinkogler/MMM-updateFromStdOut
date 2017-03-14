
Module.register("MMM-updateFromStdOut",{
	// Default module config.
	defaults: {
	},
    
	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);
		
		this.loaded = false;
		this.temperature = '';
		this.humidity= '';
		this.battery = '';
     
		this.update();
	},
    
	update: function(){
		this.sendSocketNotification('REQUEST-MMM-updateFromStdOut', this.config);
	},

	getDom: function() {	
		var wrapper = document.createElement("div");
		wrapper.className = "bright large light";
    	
		if (!this.loaded) {
			wrapper.innerHTML = "Loading ...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}
    	
		var div = document.createElement("div");
		div.innerHTML = "<span class='bold'>" + this.temperature + "</span>&deg;C&nbsp;";
		div.innerHTML += "<span class='bold'>" + this.humidity + "</span>%";
		wrapper.appendChild(div);

		return wrapper;
	},
    

	socketNotificationReceived: function(notification, payload) {
		console.log("received");
		if (notification === 'DATA-MMM-updateFromStdOut') {
			if (payload.temp != "-1000") {
				this.temperature = payload.temp;
			}
			if (payload.humidity != "-1000") {
				this.humidity = payload.humidity;
			}
			if (payload.battery != "exploding") {
				this.battery = payload.battery;
			}
			this.loaded = 1;
			this.updateDom();
		}
	},
});
