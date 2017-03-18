/*
Provided under the MIT License.

Copyright (c) 2017 Matthias Steinkogler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict';

const NodeHelper = require('node_helper');
const spawn = require('child_process').spawn;

module.exports = NodeHelper.create({
  start: function () {
    console.log('MMM-updateFromStdOut helper started...');
  },

  socketNotificationReceived: function (notification, payload) {
    // we receive this notification upon startup of the module, then we can respond.
    if (notification === 'REQUEST-MMM-updateFromStdOut') {
      var self = this;

      var timeoutId = null;

      var rtl_433 = spawn('/usr/local/bin/rtl_433', ['-q', '-G', '-s', '1000000'], {
        detached: true
      });

      rtl_433.stdout.on('data', function (data) {
        try {
          if (timeoutId !== null) {
            clearTimeout(timeoutId);
          }
          
          // If we haven't received information from the sensor for the timeout, 
          // the battery is probably empty.
          timeoutId = setTimeout(function() {
            self.sendSocketNotification('DATA-MMM-updateFromStdOut', {
              temp: "--",
              humidity: "--",
              battery: "empty"
            });
            return;
          }, 10 * 60 * 1000); // 10 minutes

          var strData = data.toString();
          var temp = strData.split("temperature ")[1].split(" C / ")[0];
          var humidity = strData.split("humidity ")[1].split("%")[0];
          var battery = strData.split("battery ")[1].split(", ")[0];

          self.sendSocketNotification('DATA-MMM-updateFromStdOut', {
            temp: temp,
            humidity: humidity,
            battery: battery
          });
        } catch (err) {
          console.log(err);
        }
      });
    }
  }
});
